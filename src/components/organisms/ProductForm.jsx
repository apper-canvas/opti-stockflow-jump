import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import productService from "@/services/api/productService";
import supplierService from "@/services/api/supplierService";

export default function ProductForm({ product, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    category: "",
    price: "",
    cost: "",
    quantity: "",
    minStock: "",
    maxStock: "",
    supplierId: "",
    imageUrl: "",
    isActive: true
  });
  
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || "",
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        cost: product.cost?.toString() || "",
        quantity: product.quantity?.toString() || "",
        minStock: product.minStock?.toString() || "",
        maxStock: product.maxStock?.toString() || "",
        supplierId: product.supplierId?.toString() || "",
        imageUrl: product.imageUrl || "",
        isActive: product.isActive !== undefined ? product.isActive : true
      });
    } else {
      setFormData({
        sku: "",
        name: "",
        description: "",
        category: "",
        price: "",
        cost: "",
        quantity: "",
        minStock: "",
        maxStock: "",
        supplierId: "",
        imageUrl: "",
        isActive: true
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getAll();
      setSuppliers(data.filter(supplier => supplier.isActive));
    } catch (error) {
      console.error("Failed to load suppliers:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.cost || parseFloat(formData.cost) <= 0) newErrors.cost = "Valid cost is required";
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = "Valid quantity is required";
    if (!formData.minStock || parseInt(formData.minStock) < 0) newErrors.minStock = "Valid minimum stock is required";
    if (!formData.maxStock || parseInt(formData.maxStock) < 0) newErrors.maxStock = "Valid maximum stock is required";
    if (parseInt(formData.maxStock) < parseInt(formData.minStock)) newErrors.maxStock = "Maximum stock must be greater than minimum stock";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock),
        maxStock: parseInt(formData.maxStock),
        supplierId: formData.supplierId ? parseInt(formData.supplierId) : null
      };

      if (product) {
        await productService.update(product.Id, productData);
        toast.success("Product updated successfully");
      } else {
        await productService.create(productData);
        toast.success("Product created successfully");
      }
      
      onSave();
      onClose();
    } catch (error) {
      toast.error(product ? "Failed to update product" : "Failed to create product");
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

  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "food", label: "Food & Beverage" },
    { value: "books", label: "Books" },
    { value: "home", label: "Home & Garden" },
    { value: "sports", label: "Sports & Recreation" },
    { value: "automotive", label: "Automotive" },
    { value: "health", label: "Health & Beauty" }
  ];

  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.Id.toString(),
    label: supplier.name
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Edit Product" : "Add New Product"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Enter product SKU"
            required
            error={errors.sku}
          />

          <FormField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            error={errors.name}
          />

          <FormField
            label="Category"
            type="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            placeholder="Select category"
            required
            error={errors.category}
          />

          <FormField
            label="Supplier"
            type="select"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            options={supplierOptions}
            placeholder="Select supplier (optional)"
            error={errors.supplierId}
          />

          <FormField
            label="Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            error={errors.price}
          />

          <FormField
            label="Cost"
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            error={errors.cost}
          />

          <FormField
            label="Current Stock"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            required
            error={errors.quantity}
          />

          <FormField
            label="Minimum Stock"
            type="number"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            required
            error={errors.minStock}
          />

          <FormField
            label="Maximum Stock"
            type="number"
            name="maxStock"
            value={formData.maxStock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            required
            error={errors.maxStock}
          />

          <FormField
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            error={errors.imageUrl}
          />
        </div>

        <FormField
          label="Description"
          type="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          error={errors.description}
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
            Product is active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}