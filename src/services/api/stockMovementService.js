import { toast } from "react-toastify";

class StockMovementService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = "stock_movement_c";
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "user_c"}}
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
      console.error("Error fetching stock movements:", error?.response?.data?.message || error);
      toast.error("Failed to fetch stock movements");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "user_c"}}
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
      console.error(`Error fetching stock movement ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch stock movement");
      return null;
    }
  }

  async create(movementData) {
    try {
      const params = {
        records: [{
          Name: `${movementData.type_c} - ${movementData.quantity_c} units`,
          product_id_c: parseInt(movementData.product_id_c),
          type_c: movementData.type_c,
          quantity_c: parseInt(movementData.quantity_c),
          reason_c: movementData.reason_c,
          date_c: movementData.date_c,
          user_c: movementData.user_c
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
          console.error(`Failed to create ${failed.length} stock movements: ${JSON.stringify(failed)}`);
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
      console.error("Error creating stock movement:", error?.response?.data?.message || error);
      toast.error("Failed to create stock movement");
      return null;
    }
  }

  async update(id, movementData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (movementData.product_id_c !== undefined) updateData.product_id_c = parseInt(movementData.product_id_c);
      if (movementData.type_c !== undefined) updateData.type_c = movementData.type_c;
      if (movementData.quantity_c !== undefined) updateData.quantity_c = parseInt(movementData.quantity_c);
      if (movementData.reason_c !== undefined) updateData.reason_c = movementData.reason_c;
      if (movementData.date_c !== undefined) updateData.date_c = movementData.date_c;
      if (movementData.user_c !== undefined) updateData.user_c = movementData.user_c;
      if (movementData.Name !== undefined) updateData.Name = movementData.Name;

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
          console.error(`Failed to update ${failed.length} stock movements: ${JSON.stringify(failed)}`);
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
      console.error("Error updating stock movement:", error?.response?.data?.message || error);
      toast.error("Failed to update stock movement");
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
          console.error(`Failed to delete ${failed.length} stock movements: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting stock movement:", error?.response?.data?.message || error);
      toast.error("Failed to delete stock movement");
      return false;
    }
  }
}

export default new StockMovementService();

export default new StockMovementService();