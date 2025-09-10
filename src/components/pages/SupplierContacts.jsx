import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import SupplierContactCard from "@/components/molecules/SupplierContactCard";
import SupplierForm from "@/components/organisms/SupplierForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import supplierService from "@/services/api/supplierService";

export default function SupplierContacts() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
      setFilteredSuppliers(data);
      setError("");
    } catch (error) {
      console.error("Error loading supplier contacts:", error);
      setError("Failed to load supplier contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(searchTerm) {
    if (!searchTerm.trim()) {
      setFilteredSuppliers(suppliers);
      return;
    }

    const filtered = suppliers.filter(supplier => 
      supplier.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone_c?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }

  function handleEdit(supplier) {
    setSelectedSupplier(supplier);
    setShowSupplierForm(true);
  }

  async function handleDelete(supplier) {
    if (!confirm(`Are you sure you want to delete contact for ${supplier.name_c || supplier.Name}?`)) {
      return;
    }

    try {
      await supplierService.delete(supplier.Id);
      toast.success("Supplier contact deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Error deleting supplier contact:", error);
      toast.error("Failed to delete supplier contact");
    }
  }

  function handleFormClose() {
    setShowSupplierForm(false);
    setSelectedSupplier(null);
  }

  function handleFormSave() {
    setShowSupplierForm(false);
    setSelectedSupplier(null);
    loadData();
  }

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supplier Contacts</h1>
          <p className="text-slate-600 mt-1">Manage supplier contact information</p>
        </div>
        
        <Button onClick={() => setShowSupplierForm(true)}>
          <ApperIcon name="Plus" size={18} />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search contacts by name, person, email, or phone..."
        onSearch={handleSearch}
      />

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full">
            <Empty 
              message="No supplier contacts found" 
              description="Add your first supplier contact to get started"
            />
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <SupplierContactCard
              key={supplier.Id}
              supplier={supplier}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

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