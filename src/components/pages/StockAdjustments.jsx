import { useState, useEffect } from "react";
import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import stockMovementService from "@/services/api/stockMovementService";
import productService from "@/services/api/productService";

export default function StockAdjustments() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredMovements(movements);
  }, [movements]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [movementsData, productsData] = await Promise.all([
        stockMovementService.getAll(),
        productService.getAll()
      ]);
      
setMovements(movementsData.sort((a, b) => new Date(b.date_c) - new Date(a.date_c)));
      setProducts(productsData);
    } catch (err) {
      setError("Failed to load stock movements");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredMovements(movements);
      return;
    }

    const filtered = movements.filter(movement => {
const productId = movement.product_id_c?.Id || movement.product_id_c;
      const product = products.find(p => p.Id === productId);
      return (
        product?.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.sku_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.reason_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.user_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredMovements(filtered);
  };

  const getMovementTypeVariant = (type) => {
    return type === "in" ? "success" : "error";
  };

  const getMovementTypeLabel = (type) => {
    return type === "in" ? "Stock In" : "Stock Out";
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stock Adjustments</h1>
          <p className="text-slate-600 mt-1">Track all inventory movements and changes</p>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search by product name, SKU, reason, or user..."
        onSearch={handleSearch}
        showFilters={false}
      />

      {/* Stock Movements */}
      {filteredMovements.length === 0 ? (
        <Empty
          title="No stock movements found"
          message="Stock adjustments will appear here when you make inventory changes."
          icon="ArrowUpDown"
        />
      ) : (
        <div className="space-y-4">
          {filteredMovements.map((movement) => {
const productId = movement.product_id_c?.Id || movement.product_id_c;
            const product = products.find(p => p.Id === productId);
            
            return (
              <Card key={movement.Id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
movement.type_c === "in" 
                          ? "bg-success-50 text-success-600"
                          : "bg-error-50 text-error-600"
                      }`}>
<ApperIcon 
                          name={movement.type_c === "in" ? "ArrowUp" : "ArrowDown"}
                          size={20} 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-slate-900">
{product?.name_c || product?.Name || "Unknown Product"}
                          </h3>
<Badge variant={getMovementTypeVariant(movement.type_c)}>
                            {getMovementTypeLabel(movement.type)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-600">
<span>SKU: {product?.sku_c || "N/A"}</span>
                          <span>•</span>
                          <span>Reason: {movement.reason_c}</span>
                          <span>•</span>
                          <span>By: {movement.user_c}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
movement.type_c === "in" ? "text-success-600" : "text-error-600"
                      }`}>
{movement.type_c === "in" ? "+" : "-"}{movement.quantity_c}
                      </p>
                      <p className="text-sm text-slate-500">
{format(new Date(movement.date_c), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}