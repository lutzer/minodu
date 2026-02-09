import { ApiProperty } from "@nestjs/swagger";
import { IsBooleanString, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ type: String, name: 'fullName', description: "User names" })
  @IsString()
  @IsNotEmpty()
  fullName: string;
  
  @ApiProperty({ type: String, name: 'phone', description: "User phone" })
  @IsPhoneNumber('TG', { message: 'phone must be a valid phone number' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ type: String, name: 'gender', description: "User gender" })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ type: String, name: 'password', description: "User password" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: String, name: 'isContactPerson', description: "User is the community contact person?" })
  @IsBooleanString()
  @IsOptional()
  isContactPerson: string;
}
