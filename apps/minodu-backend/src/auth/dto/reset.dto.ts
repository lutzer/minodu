import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetDto {
  @ApiProperty({ type: String, name: 'password', description: 'User\'s password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
