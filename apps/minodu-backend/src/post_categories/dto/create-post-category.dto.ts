import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostCategoryDto {
   @ApiProperty({ type: String, name: 'name', description: "Category name" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: String, name: 'nameKb', description: "Category name in Kabye" })
    @IsString()
    @IsNotEmpty()
    nameKb: string;

    @ApiProperty({
      type: String,
      name: 'image',
      description: "Category illustration image",
    })
    @IsOptional()
    image: string;
}
