import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { P1ToP2Service } from './p1-to-p2.service';
import { CreateP1ToP2Dto } from './dto/create-p1-to-p2.dto';
import { UpdateP1ToP2Dto } from './dto/update-p1-to-p2.dto';

@Controller('p1-to-p2')
export class P1ToP2Controller {
  constructor(private readonly service: P1ToP2Service) {}

  // Create a link (or switch to upsert if you prefer idempotent behavior)
  @Post()
  create(@Body() dto: CreateP1ToP2Dto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('p1Id') p1Id?: string,
    @Query('p2Id') p2Id?: string,
  ) {
    if (p1Id) return this.service.findByP1(p1Id);
    if (p2Id) return this.service.findByP2(p2Id);
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateP1ToP2Dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
