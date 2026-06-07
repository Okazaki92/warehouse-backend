import { IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TransferInventoryDto {
  @ApiProperty({ example: 'product-123' })
  @IsString()
  productId!: string;

  @ApiProperty({ example: 'warehouse-456' })
  @IsString()
  fromWarehouseId!: string;
  @ApiProperty({ example: 'warehouse-789' })
  @IsString()
  toWarehouseId!: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}
