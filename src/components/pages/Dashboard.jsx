import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import productService from "@/services/api/productService";
import stockMovementService from "@/services/api/stockMovementService";
import { format } from "date-fns";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [productsData, movementsData] = await Promise.all([
        productService.getAll(),
        stockMovementService.getAll()
      ]);
      
      setProducts(productsData);
      setMovements(movementsData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

const activeProducts = products.filter(p => p.is_active_c);
  const lowStockProducts = activeProducts.filter(p => p.quantity_c <= p.min_stock_c);
  const outOfStockProducts = activeProducts.filter(p => p.quantity_c === 0);
  
const totalValue = activeProducts.reduce((sum, product) => 
    sum + (product.quantity_c * product.cost_c), 0
  );

  const recentMovements = movements
.sort((a, b) => new Date(b.date_c) - new Date(a.date_c))
    .slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Overview of your inventory management</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={activeProducts.length.toLocaleString()}
          icon="Package"
          color="primary"
          gradient
        />
        
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length.toLocaleString()}
          icon="AlertTriangle"
          color="warning"
          gradient
        />
        
        <StatCard
          title="Out of Stock"
          value={outOfStockProducts.length.toLocaleString()}
          icon="XCircle"
          color="error"
          gradient
        />
        
        <StatCard
          title="Inventory Value"
          value={`$${totalValue.toLocaleString()}`}
          icon="DollarSign"
          color="success"
          gradient
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="AlertTriangle" size={20} className="text-warning-500" />
                Low Stock Alerts
              </CardTitle>
              <Badge variant="warning">{lowStockProducts.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" size={48} className="text-success-500 mx-auto mb-3" />
                <p className="text-slate-600">All products are well stocked!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
<div key={product.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{product.name_c || product.Name}</p>
                      <p className="text-sm text-slate-500">SKU: {product.sku_c}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-warning-600">
                        {product.quantity} units
                      </p>
                      <p className="text-xs text-slate-500">Min: {product.minStock}</p>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <p className="text-sm text-slate-500 text-center pt-2">
                    And {lowStockProducts.length - 5} more items...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Stock Movements */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="ArrowUpDown" size={20} className="text-primary-500" />
                Recent Stock Movements
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentMovements.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Package" size={48} className="text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No recent stock movements</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMovements.map((movement) => {
const productId = movement.product_id_c?.Id || movement.product_id_c;
                  const product = products.find(p => p.Id === productId);
                  return (
                    <div key={movement.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
movement.type_c === "in" 
                            ? "bg-success-50 text-success-600"
                            : "bg-error-50 text-error-600"
                        }`}>
<ApperIcon 
                            name={movement.type_c === "in" ? "ArrowUp" : "ArrowDown"}
                            size={16} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
{product?.name_c || product?.Name || "Unknown Product"}
                          </p>
                          <p className="text-sm text-slate-500">{movement.reason_c}</p>
                        </div>
                      </div>
                      <div className="text-right">
<p className={`text-sm font-medium ${
                          movement.type_c === "in" ? "text-success-600" : "text-error-600"
                        }`}>
                          {movement.type_c === "in" ? "+" : "-"}{movement.quantity_c}
                        </p>
                        <p className="text-xs text-slate-500">
{format(new Date(movement.date_c), "MMM d")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}