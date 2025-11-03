import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @ApiProperty({ type: String, name: 'idCategory', description: "Post Category ID" })
  @IsNumberString()
  @IsNotEmpty()
  idCategory: string;

  @ApiProperty({ type: String, name: 'author', description: "Post author" })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ type: String, name: 'title', description: "Post title" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, name: 'description', description: "Post description" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    name: 'image',
    description: "URL de l'image de couverture de la publication",
    example: "https://example.com/images/article-cover.jpg",
    required: false
  })
  image: string;

  @ApiProperty({
    type: String,
    name: 'attachment',
    description: "URL du fichier de la publication",
    example: "https://example.com/images/article-thumbnail.jpg",
    required: false
  })
  attachment: string;

  @ApiProperty({
    type: String,
    name: 'attachmentKb',
    description: "URL du fichier de la publication en kabye",
    example: "https://example.com/images/article-thumbnail.jpg",
    required: false
  })
  attachmentKb: string;

  @ApiProperty({ type: String, name: 'tags', description: "List of post tags ID separated by ," })
  @IsNotEmpty()
  tags: string;

  @ApiProperty({ type: String, name: 'resources', description: "List of post resources ID separated by ," })
  @IsOptional()
  resources: string;

}
