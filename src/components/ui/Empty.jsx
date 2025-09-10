import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function Empty({ 
  title = "No items found",
  message = "Get started by creating your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Package"
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={32} className="text-slate-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-center max-w-md mb-6">{message}</p>
      
      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}