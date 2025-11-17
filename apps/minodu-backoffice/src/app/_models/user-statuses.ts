// Modèle pour représenter les informations du statut d'un utilisateur
export class UserStatus {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

// Constructeur de la classe UserStatus pour créer une nouvelle instance de statut
  constructor(id: number, name: string, createdAt: string, updatedAt: string, deletedAt: string | null) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}