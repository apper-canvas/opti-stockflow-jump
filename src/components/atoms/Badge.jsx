import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    success: "bg-gradient-to-r from-success-50 to-success-100 text-success-700 border-success-200",
    warning: "bg-gradient-to-r from-warning-50 to-warning-100 text-warning-700 border-warning-200",
    error: "bg-gradient-to-r from-error-50 to-error-100 text-error-700 border-error-200",
    info: "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 border-secondary-200"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;