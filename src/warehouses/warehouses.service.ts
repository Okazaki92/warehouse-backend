import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { QueryWarehouseDto } from './dto/query-warehouse.dto';
import { paginate, PaginatedResult } from '../common/helpers/paginate.helper';
import type { Prisma } from '../generated/prisma/client';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryWarehouseDto): Promise<PaginatedResult<any>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.WarehouseWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.warehouse.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.warehouse.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    if (!warehouse) throw new NotFoundException(`Warehouse ${id} not found`);
    return warehouse;
  }

  async create(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({ data: dto });
  }

  async update(id: string, dto: UpdateWarehouseDto) {
    await this.findOne(id);
    return this.prisma.warehouse.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.warehouse.delete({ where: { id } });
  }
}
