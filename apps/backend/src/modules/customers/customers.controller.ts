import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List all customers.' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get customer by id.' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(Number(id));
  }

  @Post()
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ status: 201, description: 'Create new customer.' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({ status: 200, description: 'Update existing customer.' })
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete a customer.' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(Number(id));
  }
}
