import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostResourceDto {

  @ApiProperty({ type: String, name: 'name', description: "Resource name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    name: 'image',
    description: "Resource illustration image",
  })
  @IsOptional()
  image: string;

}
