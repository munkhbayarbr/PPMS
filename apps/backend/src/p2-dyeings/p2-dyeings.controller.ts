import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { P2DyeingsService } from './p2-dyeings.service';
import { CreateP2DyeingDto } from './dto/create-p2-dyeing.dto';
import { UpdateP2DyeingDto } from './dto/update-p2-dyeing.dto';

@Controller('p2-dyeings')
export class P2DyeingsController {
  constructor(private readonly p2DyeingsService: P2DyeingsService) {}

  @Post()
  create(@Body() dto: CreateP2DyeingDto) {
    return this.p2DyeingsService.create(dto);
  }

  @Get()
  findAll() {
    return this.p2DyeingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.p2DyeingsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateP2DyeingDto) {
    return this.p2DyeingsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.p2DyeingsService.remove(id);
  }
}
