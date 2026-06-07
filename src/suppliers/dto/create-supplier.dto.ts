import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Tech Supplies Inc.' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'contact@techsupplies.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Tech Street, Tech City' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '123456789' })
  @IsOptional()
  @IsString()
  nip?: string;
}
