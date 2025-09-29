import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { P3CardingService } from './p3-carding.service';
import { CreateP3CardingDto } from './dto/create-p3-carding.dto';
import { UpdateP3CardingDto } from './dto/update-p3-carding.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('p3-carding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p3-carding')
export class P3CardingController {
  constructor(private readonly service: P3CardingService) {}

  @Post()
  create(@Body() dto: CreateP3CardingDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateP3CardingDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
    @Post('start/:orderId/:stageIndex')
  startStage(@Param('orderId') orderId: string, @Param('stageIndex') stageIndex: string) {
    return this.service.startStage(orderId, Number(stageIndex));
  }

  @Post('batch')
  createBatch(@Body() dto: any & { orderId?: string; stageIndex?: number }) {
    return this.service.createBatch(dto);
  }

  @Post('complete/:orderId/:stageIndex')
  completeStage(@Param('orderId') orderId: string, @Param('stageIndex') stageIndex: string) {
    return this.service.completeStage(orderId, Number(stageIndex));
  }
}
