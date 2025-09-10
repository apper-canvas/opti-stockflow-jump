import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  onFilter,
  showFilters = false,
  className,
  ...props
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch?.("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <ApperIcon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
          />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-10"
            {...props}
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <ApperIcon name="X" size={16} />
            </button>
          )}
        </div>
        
        {showFilters && (
          <Button
            variant="outline"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="px-4"
          >
            <ApperIcon name="Filter" size={18} />
            Filters
          </Button>
        )}
      </div>

      {showFilters && showFilterPanel && (
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {onFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                  onChange={(e) => onFilter?.({ type: "category", value: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="food">Food & Beverage</option>
                  <option value="books">Books</option>
                  <option value="home">Home & Garden</option>
                </select>
              </div>
            )}
            
            {onFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Stock Status</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                  onChange={(e) => onFilter?.({ type: "stock", value: e.target.value })}
                >
                  <option value="">All Stock Levels</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            )}

            {onFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Supplier</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                  onChange={(e) => onFilter?.({ type: "supplier", value: e.target.value })}
                >
                  <option value="">All Suppliers</option>
                  <option value="1">TechCorp Solutions</option>
                  <option value="2">Fashion Forward Inc</option>
                  <option value="3">Fresh Foods Co</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}