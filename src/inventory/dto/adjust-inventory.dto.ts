import { IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AdjustInventoryDto {
  @ApiProperty({ example: 'product-123' })
  @IsString()
  productId!: string;

  @ApiProperty({ example: 'warehouse-456' })
  @IsString()
  warehouseId!: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  quantity!: number;
}
