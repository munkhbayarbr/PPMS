import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { P6ToP7Service } from './p6-to-p7.service';
import { CreateP6ToP7Dto } from './dto/create-p6-to-p7.dto';
import { UpdateP6ToP7Dto } from './dto/update-p6-to-p7.dto';

@ApiTags('p6-to-p7')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p6-to-p7')
export class P6ToP7Controller {
  constructor(private readonly service: P6ToP7Service) {}

  @Post() create(@Body() dto: CreateP6ToP7Dto) { return this.service.create(dto); }
  @Post('upsert') upsert(@Body() dto: CreateP6ToP7Dto) { return this.service.upsert(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Get('by-p6/:p6Id') byP6(@Param('p6Id') p6Id: string) { return this.service.findByP6(p6Id); }
  @Get('by-p7/:p7Id') byP7(@Param('p7Id') p7Id: string) { return this.service.findByP7(p7Id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateP6ToP7Dto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
