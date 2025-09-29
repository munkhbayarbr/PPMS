import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { P4SpinningService } from './p4-spinning.service';
import { CreateP4SpinningDto } from './dto/create-p4-spinning.dto';
import { UpdateP4SpinningDto } from './dto/update-p4-spinning.dto';
import { StartStageDto } from '../common/dto/start-stage-dto';
@ApiTags('p4-spinning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p4-spinning')
export class P4SpinningController {
  constructor(private readonly service: P4SpinningService) {}

  @Post()
  create(@Body() dto: CreateP4SpinningDto) {
    return this.service.create(dto);
  }
   @Post('start')
  start(@Body() dto: StartStageDto) {
    return this.service.start(dto);
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
  update(@Param('id') id: string, @Body() dto: UpdateP4SpinningDto) {
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
