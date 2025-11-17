import { Farmer } from "./farmers";
import { UserRole } from "./user-roles";
import { UserStatus } from "./user-statuses";

export class User {
    id: number;
    phone: string;
    role: UserRole;
    status: UserStatus;
    farmer: Farmer;
    lastConnexion: string;
    createdAt: string;

    constructor(id: number, phone: string, role: UserRole, status: UserStatus, farmer: Farmer, lastConnexion: string, createdAt: string) {
      this.id = id;
      this.phone = phone;
      this.role = role;
      this.status = status;
      this.farmer = farmer;
      this.lastConnexion = lastConnexion;
      this.createdAt = createdAt;
    }

    static fromJson(json: any): User {
      return new User(
        json.id,
        json.phone,
        json.role,
        json.status,
        json.farmer,
        json.lastConnexion,
        json.createdAt
      );
    }
  }