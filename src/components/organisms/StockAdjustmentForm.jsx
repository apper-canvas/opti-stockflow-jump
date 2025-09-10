import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Badge from "@/components/atoms/Badge";
import stockMovementService from "@/services/api/stockMovementService";
import productService from "@/services/api/productService";

export default function StockAdjustmentForm({ product, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    type: "in",
    quantity: "",
    reason: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: "in",
        quantity: "",
        reason: ""
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Valid quantity is required";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    const adjustmentQuantity = parseInt(formData.quantity);
if (formData.type === "out" && adjustmentQuantity > product?.quantity_c) {
      newErrors.quantity = "Cannot remove more stock than available";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const adjustmentQuantity = parseInt(formData.quantity);
      const movement = {
product_id_c: product.Id,
        type_c: formData.type,
        quantity: adjustmentQuantity,
        reason: formData.reason,
        date: new Date().toISOString(),
        user: "Current User"
      };

      // Create stock movement record
await stockMovementService.create({
        ...movement,
        quantity_c: adjustmentQuantity,
        reason_c: formData.reason,
        date_c: new Date().toISOString(),
        user_c: "Current User"
      });

      // Update product quantity
      const newQuantity = formData.type === "in" 
        ? product.quantity_c + adjustmentQuantity
        : product.quantity_c - adjustmentQuantity;

      await productService.update(product.Id, { quantity_c: newQuantity });

      toast.success(`Stock ${formData.type === "in" ? "added" : "removed"} successfully`);
      onSave();
      onClose();
    } catch (error) {
      toast.error("Failed to adjust stock");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const getNewQuantity = () => {
    if (!formData.quantity || !product) return product?.quantity || 0;
    const adjustmentQuantity = parseInt(formData.quantity);
return formData.type === "in" 
      ? product.quantity_c + adjustmentQuantity
      : Math.max(0, product.quantity_c - adjustmentQuantity);
  };

  const reasonOptions = [
    { value: "purchase", label: "Purchase/Received" },
    { value: "sale", label: "Sale/Shipment" },
    { value: "damage", label: "Damage/Loss" },
    { value: "return", label: "Customer Return" },
    { value: "correction", label: "Inventory Correction" },
    { value: "transfer", label: "Transfer" },
    { value: "other", label: "Other" }
  ];

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Stock"
      size="default"
    >
      <div className="space-y-6">
        {/* Product Info */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
<h4 className="font-semibold text-slate-900 mb-1">{product.name_c || product.Name}</h4>
              <p className="text-sm text-slate-600 mb-2">SKU: {product.sku_c}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Current Stock:</span>
                <Badge variant={product.quantity_c <= product.min_stock_c ? "warning" : "success"}>
                  {product.quantity_c} units
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Adjustment Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="in"
                    checked={formData.type === "in"}
                    onChange={handleChange}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">Add Stock (+)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="out"
                    checked={formData.type === "out"}
                    onChange={handleChange}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">Remove Stock (-)</span>
                </label>
              </div>
            </div>

            <FormField
              label="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              min="1"
              required
              error={errors.quantity}
            />
          </div>

          <FormField
            label="Reason"
            type="select"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            options={reasonOptions}
            placeholder="Select reason"
            required
            error={errors.reason}
          />

          {formData.quantity && (
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">New Stock Level:</span>
                <span className="text-lg font-bold text-primary-600">
                  {getNewQuantity()} units
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Adjust Stock
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}