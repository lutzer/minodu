import { Farmer } from "./farmers";

export class ProductAvailability {
    id: number;
    quantity: number;
    farmer: Farmer;

    constructor(id: number, quantity: number, farmer: Farmer) {
      this.id = id;
      this.quantity = quantity;
      this.farmer = farmer;
    }

    static fromJson(json: any): Farmer {
      return new Farmer(
        json.id,
        json.quantity,
        json.farmer
      );
    }
  }