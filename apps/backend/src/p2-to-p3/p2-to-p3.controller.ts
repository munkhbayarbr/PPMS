import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { P2ToP3Service } from './p2-to-p3.service';
import { CreateP2ToP3Dto } from './dto/create-p2-to-p3.dto';
import { UpdateP2ToP3Dto } from './dto/update-p2-to-p3.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('p2-to-p3')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p2-to-p3')
export class P2ToP3Controller {
  constructor(private readonly service: P2ToP3Service) {}

  @Post()
  create(@Body() dto: CreateP2ToP3Dto) {
    return this.service.create(dto);
  }

  @Post('upsert')
  upsert(@Body() dto: CreateP2ToP3Dto) {
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

  @Get('by-p2/:p2Id')
  findByP2(@Param('p2Id') p2Id: string) {
    return this.service.findByP2(p2Id);
  }

  @Get('by-p3/:p3Id')
  findByP3(@Param('p3Id') p3Id: string) {
    return this.service.findByP3(p3Id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateP2ToP3Dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
