export class Category {
    id: number;
    name: string;
    nameKb: string;
    image: string;

    constructor(id: number, name: string, nameKb: string, image: string) {
      this.id = id;
      this.name = name;
      this.nameKb = nameKb;
      this.image = image;
    }

    static fromJson(json: any): Category {
      return new Category(
        json.id,
        json.name,
        json.nameKb,
        json.image
      );
    }
  }