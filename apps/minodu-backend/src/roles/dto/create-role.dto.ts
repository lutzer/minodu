import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {

  @ApiProperty({ type: String, name: 'name', description: "Role name" })
  @IsString()
  @IsNotEmpty()
  name: string;

}
