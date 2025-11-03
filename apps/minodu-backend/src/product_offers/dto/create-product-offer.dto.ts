import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductOfferDto {

  @ApiProperty({ type: Number, name: 'productId', description: "Product ID" })
  @IsNumber()
  productId: number;

  @ApiProperty({ type: Number, name: 'farmerId', description: "Farmer ID" })
  @IsNumber()
  farmerId: number;

  @ApiProperty({ type: Number, name: 'quantity', description: "Quantity" })
  @IsNumber()
  quantity: number;

}
