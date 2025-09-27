import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { OutColorsService } from './out-colors.service';
import { CreateOutColorDto } from './dto/create-out-color.dto';
import { UpdateOutColorDto } from './dto/update-out-color.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('out-colors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('out-colors')
export class OutColorsController {
  constructor(private readonly service: OutColorsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'OutColor created' })
  create(@Body() dto: CreateOutColorDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'List OutColors' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiQuery({ name: 'take', required: false, example: 20 })
  findAll(
    @Query('q') q?: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take?: number,
  ) {
    return this.service.findAll({ q, skip, take });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get one OutColor' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'OutColor updated' })
  update(@Param('id') id: string, @Body() dto: UpdateOutColorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'OutColor deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
