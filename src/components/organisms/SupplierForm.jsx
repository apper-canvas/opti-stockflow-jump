import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import supplierService from "@/services/api/supplierService";

export default function SupplierForm({ supplier, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name_c || "",
        contactPerson: supplier.contact_person_c || "",
        email: supplier.email_c || "",
        phone: supplier.phone_c || "",
        address: supplier.address_c || "",
        isActive: supplier.is_active_c !== undefined ? supplier.is_active_c : true
      });
    } else {
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        isActive: true
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
if (supplier) {
        await supplierService.update(supplier.Id, {
          name_c: formData.name,
          Name: formData.name,
          contact_person_c: formData.contactPerson,
          email_c: formData.email,
          phone_c: formData.phone,
          address_c: formData.address,
          is_active_c: formData.isActive
        });
        toast.success("Supplier updated successfully");
      } else {
        await supplierService.create(formData);
        toast.success("Supplier created successfully");
      }
      
      onSave();
      onClose();
    } catch (error) {
      toast.error(supplier ? "Failed to update supplier" : "Failed to create supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier ? "Edit Supplier" : "Add New Supplier"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter company name"
            required
            error={errors.name}
          />

          <FormField
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Enter contact person name"
            required
            error={errors.contactPerson}
          />

          <FormField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
            error={errors.email}
          />

          <FormField
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
            error={errors.phone}
          />
        </div>

        <FormField
          label="Address"
          type="textarea"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter complete address"
          required
          error={errors.address}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
            Supplier is active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {supplier ? "Update Supplier" : "Create Supplier"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}