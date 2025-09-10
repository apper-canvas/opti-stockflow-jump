import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onAdjustStock,
  className,
  ...props 
}) {
  const getStockStatus = (quantity, minStock) => {
    if (quantity === 0) return { variant: "error", label: "Out of Stock" };
    if (quantity <= minStock) return { variant: "warning", label: "Low Stock" };
    return { variant: "success", label: "In Stock" };
  };

const stockStatus = getStockStatus(product.quantity_c, product.min_stock_c);

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200", className)} {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
<div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-slate-900 truncate">{product.name_c || product.Name}</h3>
              <Badge variant={stockStatus.variant} className="shrink-0">
                {stockStatus.label}
              </Badge>
            </div>
<p className="text-sm text-slate-500 mb-1">SKU: {product.sku_c}</p>
            <p className="text-sm text-slate-600 line-clamp-2">{product.description_c}</p>
          </div>
          {product.image_url_c && (
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
              <img 
                src={product.image_url_c} 
                alt={product.name_c || product.Name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Price:</span>
<p className="font-semibold text-slate-900">${product.price_c}</p>
            </div>
            <div>
              <span className="text-slate-500">Stock:</span>
              <p className={cn(
                "font-semibold",
                product.quantity_c <= product.min_stock_c ? "text-warning-600" : "text-success-600"
              )}>
                {product.quantity} units
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAdjustStock(product)}
              className="flex items-center gap-1"
            >
              <ApperIcon name="Package" size={14} />
              Adjust Stock
            </Button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(product)}
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              >
                <ApperIcon name="Edit" size={16} />
              </button>
              <button
                onClick={() => onDelete(product)}
                className="p-2 text-slate-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all duration-200"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}