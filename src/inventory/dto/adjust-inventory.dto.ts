import { IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AdjustInventoryDto {
  @IsString()
  productId!: string;

  @IsString()
  warehouseId!: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  quantity!: number;
}
