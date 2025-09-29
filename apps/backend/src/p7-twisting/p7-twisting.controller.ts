import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { P7TwistingService } from './p7-twisting.service';
import { CreateP7TwistingDto } from './dto/create-p7-twisting.dto';
import { UpdateP7TwistingDto } from './dto/update-p7-twisting.dto';
import { StartStageDto } from 'src/common/dto/start-stage-dto';
@ApiTags('p7-twisting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p7-twisting')
export class P7TwistingController {
  constructor(private readonly service: P7TwistingService) {}

  @Post() create(@Body() dto: CreateP7TwistingDto) { return this.service.create(dto); }
   @Post('start')
  start(@Body() dto: StartStageDto) {
    return this.service.start(dto);
  }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateP7TwistingDto) { return this.service.update(id, dto); }
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
