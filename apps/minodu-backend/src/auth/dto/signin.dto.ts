import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ type: String, name: 'phone', description: 'User phone' })
  @IsPhoneNumber('TG', { message: 'phone must be a valid phone number' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ type: String, name: 'password', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
