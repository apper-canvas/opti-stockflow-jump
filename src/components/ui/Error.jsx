import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function Error({ 
  title = "Something went wrong",
  message = "We encountered an error while loading the data. Please try again.",
  onRetry,
  showRetry = true
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-error-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-center max-w-md mb-6">{message}</p>
      
      {showRetry && onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
}