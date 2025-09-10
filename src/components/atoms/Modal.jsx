import { forwardRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Modal = forwardRef(({ className, isOpen, onClose, title, children, size = "default", ...props }, ref) => {
  const sizes = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={ref}
        className={cn(
          "relative w-full mx-4 bg-white rounded-xl shadow-premium border border-slate-200 animate-in fade-in-0 zoom-in-95 duration-200",
          sizes[size],
          className
        )}
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" size={18} className="text-slate-500" />
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;