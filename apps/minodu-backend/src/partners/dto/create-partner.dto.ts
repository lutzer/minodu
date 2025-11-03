import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreatePartnerDto {
   @ApiProperty({ type: String, name: 'name', description: "Partner's name" })
   @IsString()
   @IsNotEmpty()
   name: string;

   @ApiProperty({ type: String, name: 'adresse', description: "Partner's adresse e.g city, village .." })
   @IsString()
   @IsNotEmpty()
   adresse: string;
  
   @ApiProperty({ type: String, name: 'phone', description: "Partner's phone number" })
   @IsNumberString()
   @IsOptional()
   phone: string;
}
