import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ example: 'Main Warehouse' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '123 Warehouse Street, Warehouse City' })
  @IsString()
  location!: string;
}
