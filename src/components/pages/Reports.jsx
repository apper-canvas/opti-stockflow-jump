import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/atoms/Card";
import StatCard from "@/components/molecules/StatCard";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import productService from "@/services/api/productService";
import supplierService from "@/services/api/supplierService";
import stockMovementService from "@/services/api/stockMovementService";
import { format, subDays, isAfter } from "date-fns";

export default function Reports() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [productsData, suppliersData, movementsData] = await Promise.all([
        productService.getAll(),
        supplierService.getAll(),
        stockMovementService.getAll()
      ]);
      
      setProducts(productsData);
      setSuppliers(suppliersData);
      setMovements(movementsData);
    } catch (err) {
      setError("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const activeProducts = products.filter(p => p.isActive);
  const lowStockProducts = activeProducts.filter(p => p.quantity <= p.minStock);
  const outOfStockProducts = activeProducts.filter(p => p.quantity === 0);
  const overStockProducts = activeProducts.filter(p => p.quantity > p.maxStock);
  
  const totalInventoryValue = activeProducts.reduce((sum, product) => 
    sum + (product.quantity * product.cost), 0
  );

  const totalRetailValue = activeProducts.reduce((sum, product) => 
    sum + (product.quantity * product.price), 0
  );

  const activeSuppliers = suppliers.filter(s => s.isActive);
  
  // Recent movements (last 30 days)
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentMovements = movements.filter(movement => 
    isAfter(new Date(movement.date), thirtyDaysAgo)
  );

  const stockInMovements = recentMovements.filter(m => m.type === "in");
  const stockOutMovements = recentMovements.filter(m => m.type === "out");

  const totalStockIn = stockInMovements.reduce((sum, m) => sum + m.quantity, 0);
  const totalStockOut = stockOutMovements.reduce((sum, m) => sum + m.quantity, 0);

  // Category breakdown
  const categoryStats = {};
  activeProducts.forEach(product => {
    if (!categoryStats[product.category]) {
      categoryStats[product.category] = {
        count: 0,
        value: 0,
        lowStock: 0
      };
    }
    categoryStats[product.category].count++;
    categoryStats[product.category].value += product.quantity * product.cost;
    if (product.quantity <= product.minStock) {
      categoryStats[product.category].lowStock++;
    }
  });

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b.value - a.value)
    .slice(0, 5);

  // Top products by value
  const topProductsByValue = activeProducts
    .map(product => ({
      ...product,
      totalValue: product.quantity * product.cost
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600 mt-1">Analytics and insights for your inventory</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={activeProducts.length.toLocaleString()}
          icon="Package"
          color="primary"
          gradient
        />
        
        <StatCard
          title="Active Suppliers"
          value={activeSuppliers.length.toLocaleString()}
          icon="Users"
          color="secondary"
          gradient
        />
        
        <StatCard
          title="Inventory Value"
          value={`$${totalInventoryValue.toLocaleString()}`}
          icon="DollarSign"
          color="success"
          gradient
        />
        
        <StatCard
          title="Retail Value"
          value={`$${totalRetailValue.toLocaleString()}`}
          icon="TrendingUp"
          color="warning"
          gradient
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stock Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="BarChart3" size={20} className="text-primary-500" />
              Stock Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="CheckCircle" size={20} className="text-success-600" />
                  <span className="font-medium text-success-900">In Stock</span>
                </div>
                <span className="text-lg font-bold text-success-600">
                  {activeProducts.length - lowStockProducts.length - outOfStockProducts.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-warning-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="AlertTriangle" size={20} className="text-warning-600" />
                  <span className="font-medium text-warning-900">Low Stock</span>
                </div>
                <span className="text-lg font-bold text-warning-600">
                  {lowStockProducts.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-error-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="XCircle" size={20} className="text-error-600" />
                  <span className="font-medium text-error-900">Out of Stock</span>
                </div>
                <span className="text-lg font-bold text-error-600">
                  {outOfStockProducts.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="ArrowUp" size={20} className="text-secondary-600" />
                  <span className="font-medium text-secondary-900">Overstock</span>
                </div>
                <span className="text-lg font-bold text-secondary-600">
                  {overStockProducts.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Activity" size={20} className="text-primary-500" />
              Recent Activity (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-success-50 rounded-lg">
                  <p className="text-sm text-success-600 mb-1">Stock In</p>
                  <p className="text-2xl font-bold text-success-600">{totalStockIn}</p>
                  <p className="text-xs text-success-500">{stockInMovements.length} transactions</p>
                </div>
                
                <div className="text-center p-4 bg-error-50 rounded-lg">
                  <p className="text-sm text-error-600 mb-1">Stock Out</p>
                  <p className="text-2xl font-bold text-error-600">{totalStockOut}</p>
                  <p className="text-xs text-error-500">{stockOutMovements.length} transactions</p>
                </div>
              </div>
              
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-600 mb-1">Net Change</p>
                <p className={`text-xl font-bold ${
                  totalStockIn - totalStockOut >= 0 ? "text-success-600" : "text-error-600"
                }`}>
                  {totalStockIn - totalStockOut >= 0 ? "+" : ""}{totalStockIn - totalStockOut}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Tag" size={20} className="text-primary-500" />
              Top Categories by Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map(([category, stats]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900 capitalize">
                        {category}
                      </span>
                      <span className="font-bold text-slate-900">
                        ${stats.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{stats.count} products</span>
                      {stats.lowStock > 0 && (
                        <Badge variant="warning" className="text-xs">
                          {stats.lowStock} low stock
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products by Value */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Award" size={20} className="text-primary-500" />
              Top Products by Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProductsByValue.map((product, index) => (
                <div key={product.Id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-900 truncate">
                        {product.name}
                      </p>
                      <span className="font-bold text-slate-900">
                        ${product.totalValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>{product.quantity} units</span>
                      <span>×</span>
                      <span>${product.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}