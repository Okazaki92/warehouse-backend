import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ProductsService', () => {
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [{ id: '1', name: 'Laptop', sku: 'LAP-001' }];
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await productsService.findAll();

      expect(result).toEqual(mockProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const mockProduct = { id: '1', name: 'Laptop', sku: 'LAP-001' };
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await productsService.findOne('1');

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(productsService.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);
      const mockProduct = {
        id: '1',
        name: 'Laptop',
        sku: 'LAP-001',
        category: 'IT',
      };
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await productsService.create({
        name: 'Laptop',
        sku: 'LAP-001',
        category: 'IT',
      });

      expect(result).toEqual(mockProduct);
    });

    it('should throw ConflictException if SKU already exists', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue({
        id: '1',
        name: 'Laptop',
        sku: 'LAP-001',
        category: 'IT',
      });

      await expect(
        productsService.create({
          name: 'Laptop',
          sku: 'LAP-001',
          category: 'IT',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const mockProduct = { id: '1', name: 'Laptop', sku: 'LAP-001' };
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await productsService.remove('1');

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(productsService.remove('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
