import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { P3ToP4Service } from './p3-to-p4.service';
import { CreateP3ToP4Dto } from './dto/create-p3-to-p4.dto';
import { UpdateP3ToP4Dto } from './dto/update-p3-to-p4.dto';

@ApiTags('p3-to-p4')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p3-to-p4')
export class P3ToP4Controller {
  constructor(private readonly service: P3ToP4Service) {}

  @Post()
  create(@Body() dto: CreateP3ToP4Dto) {
    return this.service.create(dto);
  }

  @Post('upsert')
  upsert(@Body() dto: CreateP3ToP4Dto) {
    return this.service.upsert(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('by-p3/:p3Id')
  findByP3(@Param('p3Id') p3Id: string) {
    return this.service.findByP3(p3Id);
  }

  @Get('by-p4/:p4Id')
  findByP4(@Param('p4Id') p4Id: string) {
    return this.service.findByP4(p4Id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateP3ToP4Dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
