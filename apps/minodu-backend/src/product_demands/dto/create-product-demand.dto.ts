import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDemandDto {

  @ApiProperty({ type: Number, name: 'productId', description: "Product ID" })
  @IsNumber()
  productId: number;

  @ApiProperty({ type: Number, name: 'partnerId', description: "Partner ID" })
  @IsNumber()
  partnerId: number;

  @ApiProperty({ type: Number, name: 'quantity', description: "Quantity" })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: String, name: 'deadline', description: "Deadline date" })
  @IsString()
  deadline: string;

}
