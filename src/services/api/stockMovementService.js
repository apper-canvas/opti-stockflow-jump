import mockMovements from "@/services/mockData/stockMovements.json";

class StockMovementService {
  constructor() {
    this.movements = [...mockMovements];
  }

  async getAll() {
    await this.delay(250);
    return [...this.movements];
  }

  async getById(id) {
    await this.delay(200);
    const movement = this.movements.find(m => m.Id === parseInt(id));
    if (!movement) {
      throw new Error("Stock movement not found");
    }
    return { ...movement };
  }

  async create(movementData) {
    await this.delay(300);
    const newMovement = {
      ...movementData,
      Id: Math.max(...this.movements.map(m => m.Id)) + 1
    };
    this.movements.push(newMovement);
    return { ...newMovement };
  }

  async update(id, movementData) {
    await this.delay(400);
    const index = this.movements.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Stock movement not found");
    }
    
    this.movements[index] = {
      ...this.movements[index],
      ...movementData,
      Id: parseInt(id)
    };
    
    return { ...this.movements[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.movements.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Stock movement not found");
    }
    
    const deletedMovement = this.movements.splice(index, 1)[0];
    return { ...deletedMovement };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new StockMovementService();