import { Farmer } from "./farmers";
import { UserRole } from "./user-roles";
import { UserStatus } from "./user-statuses";

export class User {
    id: number;
    fullname: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    isContactPerson?: string | boolean;
    farmer: Farmer;
    lastConnexion: string;
    createdAt: string;

    constructor(id: number, fullname: string, phone: string, role: UserRole, status: UserStatus, isContactPerson: string | boolean, farmer: Farmer, lastConnexion: string, createdAt: string) {
      this.id = id;
      this.fullname = fullname;
      this.phone = phone;
      this.role = role;
      this.status = status;
      this.isContactPerson = false;
      this.farmer = farmer;
      this.lastConnexion = lastConnexion;
      this.createdAt = createdAt;
    }

    static fromJson(json: any): User {
      return new User(
        json.id,
        json.fullname,
        json.phone,
        json.role,
        json.status,
        json.isContactPerson,
        json.farmer,
        json.lastConnexion,
        json.createdAt
      );
    }
  }