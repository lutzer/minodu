import { Partner } from "./partners";
import { Product } from "./products";

export class ProductDemand {
  id: number;
  quantity: number;
  partner: Partner;
  product: Product;
  deadline: Date;
  isArchived?: boolean;
  archivedAt?: string | null;

  constructor(id: number, quantity: number, isArchived: boolean, archivedAt: string,  deadline: Date, partner: Partner, product: Product) {
    this.id = id;
    this.quantity = quantity;
    this.isArchived = isArchived;
    this.archivedAt = archivedAt;
    this.deadline = deadline;
    this.partner = partner;
    this.product = product;
  }

  static fromJson(json: any): ProductDemand {
    return new ProductDemand(
      json.id,
      json.quantity,
      json.isArchived,
      json.archivedAt,
      new Date(json.deadline),
      Partner.fromJson(json.partner),
      Product.fromJson(json.product)
    );
  }
}