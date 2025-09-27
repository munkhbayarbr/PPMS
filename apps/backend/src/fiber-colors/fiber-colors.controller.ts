import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FiberColorsService } from './fiber-colors.service';
import { CreateFiberColorDto } from './dto/create-fiber-color.dto';
import { UpdateFiberColorDto } from './dto/update-fiber-color.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('fiber-colors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fiber-colors')
export class FiberColorsController {
  constructor(private readonly service: FiberColorsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Fiber color created' })
  create(@Body() dto: CreateFiberColorDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'List fiber colors' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get one fiber color' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Fiber color updated' })
  update(@Param('id') id: string, @Body() dto: UpdateFiberColorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Fiber color deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
