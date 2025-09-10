import { toast } from "react-toastify";

class SupplierService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = "supplier_c";
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "contact_person_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "address_c"}},
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
      console.error("Error fetching suppliers:", error?.response?.data?.message || error);
      toast.error("Failed to fetch suppliers");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "contact_person_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "address_c"}},
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
      console.error(`Error fetching supplier ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch supplier");
      return null;
    }
  }

  async create(supplierData) {
    try {
      const params = {
        records: [{
          Name: supplierData.name_c,
          name_c: supplierData.name_c,
          contact_person_c: supplierData.contact_person_c,
          email_c: supplierData.email_c,
          phone_c: supplierData.phone_c,
          address_c: supplierData.address_c,
          is_active_c: supplierData.is_active_c !== undefined ? supplierData.is_active_c : true
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
          console.error(`Failed to create ${failed.length} suppliers: ${JSON.stringify(failed)}`);
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
      console.error("Error creating supplier:", error?.response?.data?.message || error);
      toast.error("Failed to create supplier");
      return null;
    }
  }

  async update(id, supplierData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (supplierData.name_c !== undefined) updateData.name_c = supplierData.name_c;
      if (supplierData.Name !== undefined) updateData.Name = supplierData.Name;
      if (supplierData.contact_person_c !== undefined) updateData.contact_person_c = supplierData.contact_person_c;
      if (supplierData.email_c !== undefined) updateData.email_c = supplierData.email_c;
      if (supplierData.phone_c !== undefined) updateData.phone_c = supplierData.phone_c;
      if (supplierData.address_c !== undefined) updateData.address_c = supplierData.address_c;
      if (supplierData.is_active_c !== undefined) updateData.is_active_c = supplierData.is_active_c;

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
          console.error(`Failed to update ${failed.length} suppliers: ${JSON.stringify(failed)}`);
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
      console.error("Error updating supplier:", error?.response?.data?.message || error);
      toast.error("Failed to update supplier");
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
          console.error(`Failed to delete ${failed.length} suppliers: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting supplier:", error?.response?.data?.message || error);
      toast.error("Failed to delete supplier");
      return false;
    }
  }
}

export default new SupplierService();

export default new SupplierService();