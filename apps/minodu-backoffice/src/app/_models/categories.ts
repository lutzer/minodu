export class Category {
    id: number;
    name: string;
    image: string;

    constructor(id: number, name: string, image: string) {
      this.id = id;
      this.name = name;
      this.image = image;
    }

    static fromJson(json: any): Category {
      return new Category(
        json.id,
        json.name,
        json.image
      );
    }
  }