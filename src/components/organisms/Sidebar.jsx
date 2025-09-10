import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
      current: location.pathname === "/"
    },
    {
      name: "Products",
      href: "/products",
      icon: "Package",
      current: location.pathname === "/products"
    },
    {
      name: "Suppliers",
      href: "/suppliers",
      icon: "Users",
      current: location.pathname === "/suppliers"
    },
    {
      name: "Stock Adjustments",
      href: "/stock-adjustments",
      icon: "ArrowUpDown",
      current: location.pathname === "/stock-adjustments"
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "BarChart3",
      current: location.pathname === "/reports"
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-slate-200 shadow-card">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Package" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">StockFlow</span>
            </div>
          </div>

          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-white shadow-lg"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )
                }
              >
                <ApperIcon name={item.icon} size={18} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-premium transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Package" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">StockFlow</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} className="text-slate-500" />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-white shadow-lg"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )
                }
              >
                <ApperIcon name={item.icon} size={18} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}