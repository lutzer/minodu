// Modèle pour représenter les informations du role d'un utilisateur
export class UserRole {
  id: number;
  name: string;

// Constructeur de la classe UserRole pour créer une nouvelle instance de role
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}