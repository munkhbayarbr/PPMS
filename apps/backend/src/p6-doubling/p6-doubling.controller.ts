import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { P6DoublingService } from './p6-doubling.service';
import { CreateP6DoublingDto } from './dto/create-p6-doubling.dto';
import { UpdateP6DoublingDto } from './dto/update-p6-doubling.dto';
import { StartStageDto } from 'src/common/dto/start-stage-dto';
@ApiTags('p6-doubling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p6-doubling')
export class P6DoublingController {
  constructor(private readonly service: P6DoublingService) {}

  @Post() create(@Body() dto: CreateP6DoublingDto) { return this.service.create(dto); }
   @Post('start')
  start(@Body() dto: StartStageDto) {
    return this.service.start(dto);
  }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateP6DoublingDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
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
