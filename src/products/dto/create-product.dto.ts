import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'LAP123' })
  @IsString()
  sku!: string;

  @ApiProperty({ example: 'Electronics' })
  @IsString()
  category!: string;

  @ApiProperty({ example: 'A high-performance laptop' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'szt' })
  @IsString()
  @IsOptional()
  unit?: string;
}
