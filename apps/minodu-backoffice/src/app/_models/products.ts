import { Category } from "./categories";
import { ProductAvailability } from "./productAvailabilities";

export class Product {
    id: number;
    name: string;
    description: string;
    salesUnit: string;
    image: string;
    price: number;
    category: Category;
    availabilities: ProductAvailability[];

    constructor(id: number, name: string, description: string, salesUnit: string, image: string, price: number, category: Category, availabilities: ProductAvailability []) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.salesUnit = salesUnit;
      this.image = image;
      this.price = price;
      this.category = category;
      this.availabilities = availabilities;
    }

    static fromJson(json: any): Product {
      return new Product(
        json.id,
        json.name,
        json.description,
        json.sales_unit,
        json.image,
        json.price,
        json.category,
        json.availabilities
      );
    }
  }