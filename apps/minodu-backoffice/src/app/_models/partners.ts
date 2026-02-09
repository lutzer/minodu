export class Partner {
  id: number;
  name: string;
  adresse: string;
  phone: string;

  constructor(id: number, name: string, adresse: string, phone: string) {
    this.id = id;
    this.name = name;
    this.adresse = adresse;
    this.phone = phone;
  }

  static fromJson(json: any): Partner {
    return new Partner(
      json.id,
      json.name,
      json.adresse,
      json.phone
    );
  }
}