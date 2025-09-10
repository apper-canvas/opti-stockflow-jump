import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-card hover:shadow-lg transition-all duration-200",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pb-4", className)}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

const CardContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
});

CardContent.displayName = "CardContent";

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-slate-900", className)}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

export { Card, CardHeader, CardContent, CardTitle };