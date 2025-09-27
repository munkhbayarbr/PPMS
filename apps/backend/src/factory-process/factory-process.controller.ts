import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FactoryProcessService } from './factory-process.service';
import { CreateFactoryProcessDto } from './dto/create-factory-process.dto';
import { UpdateFactoryProcessDto } from './dto/update-factory-process.dto';

@ApiTags('factory-process')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('factory-process')
export class FactoryProcessController {
  constructor(private readonly service: FactoryProcessService) {}

  @Post() @ApiCreatedResponse({ description: 'FactoryProcess created' })
  create(@Body() dto: CreateFactoryProcessDto) { return this.service.create(dto); }

  @Get() @ApiOkResponse({ description: 'List factory processes' })
  findAll() { return this.service.findAll(); }

  @Get(':id') @ApiOkResponse({ description: 'Get one' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id') @ApiOkResponse({ description: 'Updated' })
  update(@Param('id') id: string, @Body() dto: UpdateFactoryProcessDto) { return this.service.update(id, dto); }

  @Delete(':id') @ApiOkResponse({ description: 'Deleted' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
