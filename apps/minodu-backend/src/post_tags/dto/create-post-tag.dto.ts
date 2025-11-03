import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostTagDto {
    @ApiProperty({ type: String, name: 'name', description: "Tag name" })
    @IsOptional()
    name: string;
  
    @ApiProperty({
      type: String,
      name: 'image',
      description: "Tag illustration image",
    })
    @IsOptional()
    image: string;

}
