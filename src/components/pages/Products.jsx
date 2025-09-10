import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ProductCard from "@/components/molecules/ProductCard";
import ProductForm from "@/components/organisms/ProductForm";
import StockAdjustmentForm from "@/components/organisms/StockAdjustmentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import productService from "@/services/api/productService";
import supplierService from "@/services/api/supplierService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [productsData, suppliersData] = await Promise.all([
productService.getAll(),
        supplierService.getAll()
      ]);
      
      setProducts(productsData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
product.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description_c?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = (filter) => {
    let filtered = products;

    switch (filter.type) {
      case "category":
        if (filter.value) {
filtered = filtered.filter(product => product.category_c === filter.value);
        }
        break;
      case "stock":
        switch (filter.value) {
          case "in-stock":
            filtered = filtered.filter(product => product.quantity_c > product.min_stock_c);
            break;
          case "low-stock":
            filtered = filtered.filter(product => product.quantity_c <= product.min_stock_c && product.quantity_c > 0);
            break;
          case "out-of-stock":
            filtered = filtered.filter(product => product.quantity_c === 0);
            break;
          default:
            break;
        }
        break;
      case "supplier":
        if (filter.value) {
const supplierId = selectedProduct.supplier_id_c?.Id || selectedProduct.supplier_id_c;
          filtered = filtered.filter(product => supplierId?.toString() === filter.value);
        }
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productService.delete(product.Id);
        toast.success("Product deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    setShowStockForm(true);
  };

  const handleFormClose = () => {
    setShowProductForm(false);
    setShowStockForm(false);
    setSelectedProduct(null);
  };

  const handleFormSave = () => {
    loadData();
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1">Manage your product inventory</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ApperIcon name="Grid3X3" size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ApperIcon name="List" size={18} />
            </button>
          </div>
          
          <Button onClick={() => setShowProductForm(true)}>
            <ApperIcon name="Plus" size={18} />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar
        placeholder="Search products by name, SKU, or description..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        showFilters={true}
      />

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <Empty
          title="No products found"
          message="Start by adding your first product to the inventory."
          actionLabel="Add Product"
          onAction={() => setShowProductForm(true)}
          icon="Package"
        />
      ) : (
        <div className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.Id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdjustStock={handleAdjustStock}
              className={viewMode === "list" ? "w-full" : ""}
            />
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        product={selectedProduct}
        isOpen={showProductForm}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentForm
        product={selectedProduct}
        isOpen={showStockForm}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />
    </div>
  );
}