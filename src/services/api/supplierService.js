import mockSuppliers from "@/services/mockData/suppliers.json";

class SupplierService {
  constructor() {
    this.suppliers = [...mockSuppliers];
  }

  async getAll() {
    await this.delay(250);
    return [...this.suppliers];
  }

  async getById(id) {
    await this.delay(200);
    const supplier = this.suppliers.find(s => s.Id === parseInt(id));
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    return { ...supplier };
  }

  async create(supplierData) {
    await this.delay(400);
    const newSupplier = {
      ...supplierData,
      Id: Math.max(...this.suppliers.map(s => s.Id)) + 1
    };
    this.suppliers.push(newSupplier);
    return { ...newSupplier };
  }

  async update(id, supplierData) {
    await this.delay(400);
    const index = this.suppliers.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Supplier not found");
    }
    
    this.suppliers[index] = {
      ...this.suppliers[index],
      ...supplierData,
      Id: parseInt(id)
    };
    
    return { ...this.suppliers[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.suppliers.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Supplier not found");
    }
    
    const deletedSupplier = this.suppliers.splice(index, 1)[0];
    return { ...deletedSupplier };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new SupplierService();