import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, OrderType } from '../generated/prisma/client';


@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        supplier: { select: { id: true, name: true } },
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, unit: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        supplier: { select: { id: true, name: true } },
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, unit: true },
            },
          },
        },
      },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async create(dto: CreateOrderDto, userId: string) {
    if (dto.type === OrderType.INBOUND && !dto.supplierId) {
      throw new BadRequestException('INBOUND order requires a supplierId');
    }
    if (!dto.warehouseId) {
      throw new BadRequestException('warehouseId is required');
    }

    return this.prisma.order.create({
      data: {
        type: dto.type,
        notes: dto.notes,
        createdById: userId,
        supplierId: dto.supplierId,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot update status of ${order.status} order`,
      );
    }

    if (dto.status === OrderStatus.COMPLETED) {
      await this.applyInventoryChanges(order);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only PENDING orders can be deleted');
    }
    return this.prisma.order.delete({ where: { id } });
  }

  private async applyInventoryChanges(
    order: Awaited<ReturnType<typeof this.findOne>>,
  ) {
    const isInbound = order.type === OrderType.INBOUND;

    const operations = order.items.map((item) => {
      const warehouseId = (order as any).warehouseId as string;
      return this.prisma.inventoryItem.upsert({
        where: {
          productId_warehouseId: {
            productId: item.product.id,
            warehouseId,
          },
        },
        update: {
          quantity: isInbound
            ? { increment: item.quantity }
            : { decrement: item.quantity },
        },
        create: {
          productId: item.product.id,
          warehouseId,
          quantity: isInbound ? item.quantity : 0,
        },
      });
    });

    await this.prisma.$transaction(operations);
  }
}
