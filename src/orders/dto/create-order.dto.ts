import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType } from '../../generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'product-123' })
  @IsString()
  productId!: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'INBOUND',
    description: 'Type of the order, either INBOUND or OUTBOUND',
  })
  @IsEnum(OrderType)
  type!: OrderType;

  @ApiProperty({ example: 'supplier-456' })
  @IsOptional()
  @IsString()
  supplierId?: string;

  @ApiProperty({ example: 'warehouse-789' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiProperty({ example: 'Urgent order for next week' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
