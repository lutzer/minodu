import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SyncWeatherDto {
  @ApiProperty({
    type: Number,
    description: 'Main temperature in °C',
    required: false,
    example: 22
  })
  @IsNumber()
  @IsOptional()
  temp?: number;

  @ApiProperty({
    type: Number,
    description: 'Secondary temperature in °C',
    required: false,
    example: 21.8
  })
  @IsNumber()
  @IsOptional()
  temp1?: number;

  @ApiProperty({
    type: Number,
    description: 'Main humidity percentage',
    required: false,
    example: 45
  })
  @IsNumber()
  @IsOptional()
  hum?: number;

  @ApiProperty({
    type: Number,
    description: 'Secondary humidity percentage',
    required: false,
    example: 47.2
  })
  @IsNumber()
  @IsOptional()
  hum1?: number;

  @ApiProperty({
    type: Number,
    description: 'Atmospheric pressure in hPa',
    required: false,
    example: 1013.25
  })
  @IsNumber()
  @IsOptional()
  press?: number;

  @ApiProperty({
    type: Number,
    description: 'Luminosity in lux',
    required: false,
    example: 320.5
  })
  @IsNumber()
  @IsOptional()
  lux?: number;

  @ApiProperty({
    type: Number,
    description: 'Ambient light sensor raw value',
    required: false,
    example: 215
  })
  @IsNumber()
  @IsOptional()
  ambient?: number;

  @ApiProperty({
    type: Number,
    description: 'Carbon monoxide concentration in ppm',
    required: false,
    example: 0.5
  })
  @IsNumber()
  @IsOptional()
  CO?: number;

  @ApiProperty({
    type: Number,
    description: 'Nitrogen dioxide concentration in ppb',
    required: false,
    example: 12
  })
  @IsNumber()
  @IsOptional()
  NO2?: number;
}