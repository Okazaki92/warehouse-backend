import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { paginate, PaginatedResult } from '../common/helpers/paginate.helper';
import type { Prisma } from '../generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryProductDto): Promise<PaginatedResult<any>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.category) {
      where.category = query.category;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });
    if (existing) throw new ConflictException(`SKU ${dto.sku} already exists`);

    return this.prisma.product.create({ data: dto });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
