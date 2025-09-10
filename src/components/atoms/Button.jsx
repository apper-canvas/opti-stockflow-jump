import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-lg hover:scale-105 border-0",
    secondary: "bg-gradient-secondary text-white hover:shadow-lg hover:scale-105 border-0",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 bg-white",
    ghost: "text-slate-600 hover:bg-slate-100 border-0",
    success: "bg-gradient-to-r from-success-500 to-success-600 text-white hover:shadow-lg hover:scale-105 border-0",
    warning: "bg-gradient-to-r from-warning-500 to-warning-600 text-white hover:shadow-lg hover:scale-105 border-0",
    error: "bg-gradient-to-r from-error-500 to-error-600 text-white hover:shadow-lg hover:scale-105 border-0"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-card",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;