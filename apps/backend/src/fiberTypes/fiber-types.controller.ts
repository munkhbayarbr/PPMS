import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FiberTypesService } from './fiber-types.service';
import { CreateFiberTypeDto, UpdateFiberTypeDto } from './dto/fiber-types.dto';

@ApiTags('Fiber Types')
@Controller('fiber-types')
export class FiberTypesController {
  constructor(private service: FiberTypesService) {}

  @Post()
  create(@Body() dto: CreateFiberTypeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFiberTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
