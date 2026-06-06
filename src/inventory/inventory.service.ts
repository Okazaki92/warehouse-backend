import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { TransferInventoryDto } from './dto/transfer-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(warehouseId?: string, productId?: string) {
    return this.prisma.inventoryItem.findMany({
      where: {
        ...(warehouseId && { warehouseId }),
        ...(productId && { productId }),
      },
      include: {
        product: { select: { id: true, name: true, sku: true, unit: true } },
        warehouse: { select: { id: true, name: true, location: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async adjust(dto: AdjustInventoryDto) {
    await this.validateProductAndWarehouse(dto.productId, dto.warehouseId);

    return this.prisma.inventoryItem.upsert({
      where: {
        productId_warehouseId: {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
        },
      },
      update: { quantity: dto.quantity },
      create: {
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
      },
    });
  }

  async transfer(dto: TransferInventoryDto) {
    if (dto.fromWarehouseId === dto.toWarehouseId) {
      throw new BadRequestException(
        'Source and destination warehouse must be different',
      );
    }

    await this.validateProductAndWarehouse(dto.productId, dto.fromWarehouseId);
    await this.validateProductAndWarehouse(dto.productId, dto.toWarehouseId);

    const source = await this.prisma.inventoryItem.findUnique({
      where: {
        productId_warehouseId: {
          productId: dto.productId,
          warehouseId: dto.fromWarehouseId,
        },
      },
    });

    if (!source || source.quantity < dto.quantity) {
      throw new BadRequestException('Insufficient stock in source warehouse');
    }

    return this.prisma.$transaction([
      this.prisma.inventoryItem.update({
        where: {
          productId_warehouseId: {
            productId: dto.productId,
            warehouseId: dto.fromWarehouseId,
          },
        },
        data: { quantity: { decrement: dto.quantity } },
      }),
      this.prisma.inventoryItem.upsert({
        where: {
          productId_warehouseId: {
            productId: dto.productId,
            warehouseId: dto.toWarehouseId,
          },
        },
        update: { quantity: { increment: dto.quantity } },
        create: {
          productId: dto.productId,
          warehouseId: dto.toWarehouseId,
          quantity: dto.quantity,
        },
      }),
    ]);
  }

  private async validateProductAndWarehouse(
    productId: string,
    warehouseId: string,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse)
      throw new NotFoundException(`Warehouse ${warehouseId} not found`);
  }
}
