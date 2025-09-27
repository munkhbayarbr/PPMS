import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { P5ToP6Service } from './p5-to-p6.service';
import { CreateP5ToP6Dto } from './dto/create-p5-to-p6.dto';
import { UpdateP5ToP6Dto } from './dto/update-p5-to-p6.dto';

@ApiTags('p5-to-p6')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p5-to-p6')
export class P5ToP6Controller {
  constructor(private readonly service: P5ToP6Service) {}

  @Post() create(@Body() dto: CreateP5ToP6Dto) { return this.service.create(dto); }
  @Post('upsert') upsert(@Body() dto: CreateP5ToP6Dto) { return this.service.upsert(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Get('by-p5/:p5Id') byP5(@Param('p5Id') p5Id: string) { return this.service.findByP5(p5Id); }
  @Get('by-p6/:p6Id') byP6(@Param('p6Id') p6Id: string) { return this.service.findByP6(p6Id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateP5ToP6Dto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
