import { User } from "./users";
import { Product } from "./products";

export class ProductAvailability {
  id: number;
  quantity: number;
  user: User;
  product: Product;
  isArchived?: boolean;
  archivedAt?: string | null;

  constructor(id: number, quantity: number, archivedAt: string, isArchived: boolean, user: User, product: Product) {
    this.id = id;
    this.quantity = quantity;
    this.user = user;
    this.product = product;
    this.isArchived = isArchived;   
    this.archivedAt = archivedAt;
  }

  static fromJson(json: any): ProductAvailability {
    return new ProductAvailability(
      json.id,
      json.quantity,
      json.archivedAt,
      json.isArchived,
      User.fromJson(json.user),
      Product.fromJson(json.product)
    );
  }
}