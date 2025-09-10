import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function SupplierContactCard({ 
  supplier, 
  onEdit, 
  onDelete,
  className,
  ...props 
}) {
  const contactPerson = supplier.contact_person_c || "Not specified";
  const email = supplier.email_c || "No email provided";
  const phone = supplier.phone_c || "No phone provided";
  const address = supplier.address_c || "No address provided";
  const supplierName = supplier.name_c || supplier.Name || "Unnamed Supplier";

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300", className)} {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-lg leading-tight">
              {supplierName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={supplier.is_active_c ? "success" : "secondary"}>
                {supplier.is_active_c ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Person */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="User" size={16} className="text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700">Contact Person</p>
            <p className="text-sm text-slate-600 truncate">{contactPerson}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Mail" size={16} className="text-secondary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700">Email</p>
            <p className="text-sm text-slate-600 truncate">{email}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Phone" size={16} className="text-success-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700">Phone</p>
            <p className="text-sm text-slate-600 truncate">{phone}</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <ApperIcon name="MapPin" size={16} className="text-warning-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700">Address</p>
            <p className="text-sm text-slate-600 leading-relaxed">{address}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          {supplier.email_c && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`mailto:${supplier.email_c}`, '_blank')}
            >
              <ApperIcon name="Mail" size={14} />
              Email
            </Button>
          )}
          {supplier.phone_c && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`tel:${supplier.phone_c}`, '_blank')}
            >
              <ApperIcon name="Phone" size={14} />
              Call
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}