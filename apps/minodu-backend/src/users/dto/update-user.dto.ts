import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from 'src/users/entities/gender.enum';

export class UpdateUserDto {
  @ApiProperty({ type: String, name: 'fullName', description: 'User fullname' })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ enum: Gender, name: 'gender', description: 'User gender' })
  @IsString()
  @IsOptional()
  gender: Gender;

  @ApiProperty({ type: String, name: 'phone', description: "User phone number" })
  @IsNumberString()
  @IsOptional()
  phone: string;
}

export class UpdatePwdDto {
  @ApiProperty({ type: String, name: 'password', description: "User password" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
