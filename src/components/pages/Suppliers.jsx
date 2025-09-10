import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import SupplierCard from "@/components/molecules/SupplierCard";
import SupplierForm from "@/components/organisms/SupplierForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import supplierService from "@/services/api/supplierService";
import productService from "@/services/api/productService";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredSuppliers(suppliers);
  }, [suppliers]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [suppliersData, productsData] = await Promise.all([
        supplierService.getAll(),
productService.getAll()
      ]);
      
      setSuppliers(suppliersData);
      setProducts(productsData);
    } catch (err) {
      setError("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredSuppliers(suppliers);
      return;
    }

    const filtered = suppliers.filter(supplier =>
supplier.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email_c?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierForm(true);
  };

  const handleDelete = async (supplier) => {
const supplierProducts = products.filter(p => {
      const supplierId = p.supplier_id_c?.Id || p.supplier_id_c;
      return supplierId === supplier.Id;
    });
    
    if (supplierProducts.length > 0) {
      toast.error(`Cannot delete supplier. ${supplierProducts.length} products are linked to this supplier.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
      try {
        await supplierService.delete(supplier.Id);
        toast.success("Supplier deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete supplier");
      }
    }
  };

  const handleFormClose = () => {
    setShowSupplierForm(false);
    setSelectedSupplier(null);
  };

  const handleFormSave = () => {
    loadData();
  };

const getSupplierProductCount = (supplierId) => {
    return products.filter(product => {
      const productSupplierId = product.supplier_id_c?.Id || product.supplier_id_c;
      return productSupplierId === supplierId;
    }).length;
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-600 mt-1">Manage your supplier relationships</p>
        </div>
        
        <Button onClick={() => setShowSupplierForm(true)}>
          <ApperIcon name="Plus" size={18} />
          Add Supplier
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search suppliers by name, contact person, or email..."
        onSearch={handleSearch}
        showFilters={false}
      />

      {/* Suppliers Grid */}
      {filteredSuppliers.length === 0 ? (
        <Empty
          title="No suppliers found"
          message="Start by adding your first supplier to manage your inventory sources."
          actionLabel="Add Supplier"
          onAction={() => setShowSupplierForm(true)}
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.Id}
              supplier={supplier}
              productCount={getSupplierProductCount(supplier.Id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Supplier Form Modal */}
      <SupplierForm
        supplier={selectedSupplier}
        isOpen={showSupplierForm}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />
    </div>
  );
}