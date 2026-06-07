import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryWarehouseDto } from './dto/query-warehouse.dto';

@ApiTags('Warehouses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('warehouses')
export class WarehousesController {
  constructor(private warehousesService: WarehousesService) {}

  @Get()
  findAll(@Query() query: QueryWarehouseDto) {
    return this.warehousesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehousesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.warehousesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }
}
