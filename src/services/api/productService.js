import { toast } from "react-toastify";

class ProductService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = "product_c";
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "sku_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "cost_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "min_stock_c"}},
          {"field": {"Name": "max_stock_c"}},
          {"field": {"Name": "supplier_id_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "last_updated_c"}},
          {"field": {"Name": "is_active_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      toast.error("Failed to fetch products");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "sku_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "cost_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "min_stock_c"}},
          {"field": {"Name": "max_stock_c"}},
          {"field": {"Name": "supplier_id_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "last_updated_c"}},
          {"field": {"Name": "is_active_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch product");
      return null;
    }
  }

  async create(productData) {
    try {
      const params = {
        records: [{
          Name: productData.name_c,
          sku_c: productData.sku_c,
          name_c: productData.name_c,
          description_c: productData.description_c,
          category_c: productData.category_c,
          price_c: parseFloat(productData.price_c),
          cost_c: parseFloat(productData.cost_c),
          quantity_c: parseInt(productData.quantity_c),
          min_stock_c: parseInt(productData.min_stock_c),
          max_stock_c: parseInt(productData.max_stock_c),
          supplier_id_c: productData.supplier_id_c ? parseInt(productData.supplier_id_c) : null,
          image_url_c: productData.image_url_c,
          last_updated_c: new Date().toISOString(),
          is_active_c: productData.is_active_c !== undefined ? productData.is_active_c : true
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} products: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error);
      toast.error("Failed to create product");
      return null;
    }
  }

  async update(id, productData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (productData.name_c !== undefined) updateData.name_c = productData.name_c;
      if (productData.Name !== undefined) updateData.Name = productData.Name;
      if (productData.sku_c !== undefined) updateData.sku_c = productData.sku_c;
      if (productData.description_c !== undefined) updateData.description_c = productData.description_c;
      if (productData.category_c !== undefined) updateData.category_c = productData.category_c;
      if (productData.price_c !== undefined) updateData.price_c = parseFloat(productData.price_c);
      if (productData.cost_c !== undefined) updateData.cost_c = parseFloat(productData.cost_c);
      if (productData.quantity_c !== undefined) updateData.quantity_c = parseInt(productData.quantity_c);
      if (productData.min_stock_c !== undefined) updateData.min_stock_c = parseInt(productData.min_stock_c);
      if (productData.max_stock_c !== undefined) updateData.max_stock_c = parseInt(productData.max_stock_c);
      if (productData.supplier_id_c !== undefined) updateData.supplier_id_c = productData.supplier_id_c ? parseInt(productData.supplier_id_c) : null;
      if (productData.image_url_c !== undefined) updateData.image_url_c = productData.image_url_c;
      if (productData.is_active_c !== undefined) updateData.is_active_c = productData.is_active_c;
      
      updateData.last_updated_c = new Date().toISOString();

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} products: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error);
      toast.error("Failed to update product");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} products: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error);
      toast.error("Failed to delete product");
      return false;
    }
  }
}

export default new ProductService();
