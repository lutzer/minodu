export class Tag {
    id: number;
    name: string;
    image: string;

    constructor(id: number, name: string, image: string) {
      this.id = id;
      this.name = name;
      this.image = image;
    }

    static fromJson(json: any): Tag {
      return new Tag(
        json.id,
        json.name,
        json.image
      );
    }
  }