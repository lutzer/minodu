import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ type: String, name: 'name', description: "Product name" })
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({
      type: String,
      name: 'image',
      description: "Product illustration image",
    })
    @IsOptional()
    image: string;

    @ApiProperty({ type: String, name: 'description', description: "Product description" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: String, name: 'sale unit', description: "Product sales unit" })
    @IsString()
    @IsNotEmpty()
    sales_unit: string;

    @ApiProperty({ type: Number, name: 'price', description: "Product price" })
    @IsString()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ type: Number, name: 'category', description: "Product category ID" })
    @IsString()
    @IsNotEmpty()
    categoryId: number;

}