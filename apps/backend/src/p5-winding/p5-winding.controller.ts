import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { P5WindingService } from './p5-winding.service';
import { CreateP5WindingDto } from './dto/create-p5-winding.dto';
import { UpdateP5WindingDto } from './dto/update-p5-winding.dto';
import { StartStageDto } from 'src/common/dto/start-stage-dto';
@ApiTags('p5-winding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p5-winding')
export class P5WindingController {
  constructor(private readonly service: P5WindingService) {}

  @Post() create(@Body() dto: CreateP5WindingDto) { return this.service.create(dto); }
   @Post('start')
  start(@Body() dto: StartStageDto) {
    return this.service.start(dto);
  }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateP5WindingDto) { return this.service.update(id, dto); }
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
