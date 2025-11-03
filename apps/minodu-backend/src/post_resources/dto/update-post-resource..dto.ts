import { PartialType } from '@nestjs/swagger';
import { CreatePostResourceDto } from './create-post-resource.dto';

export class UpdatePostResourceDto extends PartialType(CreatePostResourceDto) {}
