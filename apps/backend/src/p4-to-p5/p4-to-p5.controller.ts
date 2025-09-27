import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { P4ToP5Service } from './p4-to-p5.service';
import { CreateP4ToP5Dto } from './dto/create-p4-to-p5.dto';
import { UpdateP4ToP5Dto } from './dto/update-p4-to-p5.dto';

@ApiTags('p4-to-p5')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p4-to-p5')
export class P4ToP5Controller {
  constructor(private readonly service: P4ToP5Service) {}

  @Post() create(@Body() dto: CreateP4ToP5Dto) { return this.service.create(dto); }
  @Post('upsert') upsert(@Body() dto: CreateP4ToP5Dto) { return this.service.upsert(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Get('by-p4/:p4Id') byP4(@Param('p4Id') p4Id: string) { return this.service.findByP4(p4Id); }
  @Get('by-p5/:p5Id') byP5(@Param('p5Id') p5Id: string) { return this.service.findByP5(p5Id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateP4ToP5Dto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
