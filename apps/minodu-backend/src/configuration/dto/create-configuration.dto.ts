import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateConfigurationDto {

  @ApiProperty({ type: String, name: 'name', description: "Community name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, name: 'intro', description: "Community introduction" })
  @IsString()
  intro: string;

  @ApiProperty({ type: String, name: 'adresse', description: "Community adresse" })
  @IsString()
  adresse: string;

  @ApiProperty({ type: String, name: 'location', description: "Community location" })
  @IsString()
  location: string;

  @ApiProperty({ type: String, name: 'whatsappLink', description: "Advice center whatsappLink" })
  @IsString()
  whatsappLink: string;

  @ApiProperty({ type: String, name: 'stationLink', description: "Teleagriculture station link" })
  @IsString()
  stationLink: string;
}