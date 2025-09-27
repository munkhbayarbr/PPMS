import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { P1StocksService } from './p1-stocks.service';
import { CreateP1StockDto } from './dto/create-p1-stock.dto';
import { UpdateP1StockDto } from './dto/update-p1-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('p1-stocks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p1-stocks')
export class P1StocksController {
  constructor(private readonly service: P1StocksService) {}

  @Post()
  @ApiCreatedResponse({ description: 'P1 stock created' })
  create(@Body() dto: CreateP1StockDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'List P1 stocks' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get one P1 stock' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'P1 stock updated' })
  update(@Param('id') id: string, @Body() dto: UpdateP1StockDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'P1 stock deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
