import { Controller, Get, Post, Body, Param, Delete, Put, Query, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ListOrdersQuery } from './dto/list-orders.query';
import { ApiTags, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT','IN_PROGRESS','COMPLETED','SHIPPED','CANCELLED'] })
  @ApiQuery({ name: 'customer_id', required: false, type: Number })
  @ApiQuery({ name: 'from', required: false, description: 'ISO date' })
  @ApiQuery({ name: 'to', required: false, description: 'ISO date' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'orderBy', required: false, example: 'recorded_at:desc' })
  @ApiResponse({ status: 200, description: 'Paginated list of orders.' })
  list(@Query() query: ListOrdersQuery) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get order by id.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Create an order (optionally with route steps).' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Update an order; if steps[] provided, route is replaced.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete an order.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
