import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  color = "primary",
  gradient = false,
  className,
  ...props
}) {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    secondary: "text-secondary-600 bg-secondary-50",
    success: "text-success-600 bg-success-50",
    warning: "text-warning-600 bg-warning-50",
    error: "text-error-600 bg-error-50"
  };

  const changeClasses = {
    positive: "text-success-600 bg-success-50",
    negative: "text-error-600 bg-error-50",
    neutral: "text-slate-600 bg-slate-50"
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          {icon && (
            <div className={cn("p-2 rounded-lg", colorClasses[color])}>
              <ApperIcon name={icon} size={20} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className={cn(
            "text-2xl font-bold",
            gradient ? "text-gradient" : "text-slate-900"
          )}>
            {value}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <div className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                changeClasses[changeType]
              )}>
                <ApperIcon 
                  name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                  size={12} 
                  className="mr-1" 
                />
                {change}
              </div>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}