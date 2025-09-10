import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function SupplierCard({ 
  supplier, 
  productCount = 0,
  onEdit, 
  onDelete,
  className,
  ...props 
}) {
  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200", className)} {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
              <Badge variant={supplier.isActive ? "success" : "error"}>
                {supplier.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{supplier.contactPerson}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <ApperIcon name="Mail" size={14} className="text-slate-400" />
              <span className="text-slate-600">{supplier.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Phone" size={14} className="text-slate-400" />
              <span className="text-slate-600">{supplier.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <ApperIcon name="MapPin" size={14} className="text-slate-400 mt-0.5" />
              <span className="text-slate-600 text-xs leading-relaxed">{supplier.address}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-sm">
              <span className="text-slate-500">Products: </span>
              <span className="font-semibold text-primary-600">{productCount}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(supplier)}
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              >
                <ApperIcon name="Edit" size={16} />
              </button>
              <button
                onClick={() => onDelete(supplier)}
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