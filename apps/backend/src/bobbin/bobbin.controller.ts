import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BobbinService } from './bobbin.service';
import { CreateBobbinDto } from './dto/create-bobbin.dto';
import { UpdateBobbinDto } from './dto/update-bobbin.dto';

@ApiTags('bobbin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bobbin')
export class BobbinController {
  constructor(private readonly service: BobbinService) {}

  @Post() @ApiCreatedResponse({ description: 'Bobbin created' })
  create(@Body() dto: CreateBobbinDto) { return this.service.create(dto); }

  @Get() @ApiOkResponse({ description: 'List bobbins' })
  findAll() { return this.service.findAll(); }

  @Get(':id') @ApiOkResponse({ description: 'Get one bobbin' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id') @ApiOkResponse({ description: 'Bobbin updated' })
  update(@Param('id') id: string, @Body() dto: UpdateBobbinDto) { return this.service.update(id, dto); }

  @Delete(':id') @ApiOkResponse({ description: 'Bobbin deleted' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
