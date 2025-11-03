import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserStatusDto {

  @ApiProperty({ type: String, name: 'name', description: "User status name" })
  @IsString()
  @IsNotEmpty()
  name: string;

}
