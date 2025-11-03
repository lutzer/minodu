import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProductCategoryDto {
    @ApiProperty({ type: String, name: 'name', description: "Tag name" })
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({
      type: String,
      name: 'image',
      description: "Tag illustration image",
    })
    @IsOptional()
    image: string;
}
