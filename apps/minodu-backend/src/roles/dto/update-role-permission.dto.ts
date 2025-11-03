import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class UpdateRolePermissionDto {

  @ApiProperty({ type: [String], name: 'permissions', description: "Permissions names" })
  @IsArray()
  @IsNotEmpty()
  permissions: string[];

}
