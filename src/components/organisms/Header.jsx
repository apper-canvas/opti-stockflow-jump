import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function Header({ onMenuClick, title, actions }) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-card sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            {title && (
              <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}