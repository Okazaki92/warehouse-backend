import { IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TransferInventoryDto {
  @IsString()
  productId!: string;

  @IsString()
  fromWarehouseId!: string;

  @IsString()
  toWarehouseId!: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}
