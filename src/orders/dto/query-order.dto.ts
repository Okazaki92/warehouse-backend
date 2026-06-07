import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import type { OrderStatus, OrderType } from '../../generated/prisma/browser';

export class QueryOrderDto extends PaginationDto {
  @IsOptional()
  @IsString()
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  type?: OrderType;
}
