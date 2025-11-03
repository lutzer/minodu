import { PartialType } from '@nestjs/swagger';
import { CreateProductDemandDto } from './create-product-demand.dto';

export class UpdateProductDemandDto extends PartialType(CreateProductDemandDto) {}
