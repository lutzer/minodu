export class Farmer {
    id: number;
    fullname: string;
    gender: string;

    constructor(id: number, fullname: string, gender: string) {
      this.id = id;
      this.fullname = fullname;
      this.gender = gender;
    }

    static fromJson(json: any): Farmer {
      return new Farmer(
        json.id,
        json.fullname,
        json.gender
      );
    }
  }