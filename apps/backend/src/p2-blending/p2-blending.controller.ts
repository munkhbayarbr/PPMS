import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { P2BlendingService } from './p2-blending.service';
import { CreateP2BlendingDto } from './dto/create-p2-blending.dto';
import { UpdateP2BlendingDto } from './dto/update-p2-blending.dto';

@ApiTags('p2-blending')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('p2-blending')
export class P2BlendingController {
  constructor(private readonly service: P2BlendingService) {}

  @Post() @ApiCreatedResponse({ description: 'P2Blending created' })
  create(@Body() dto: CreateP2BlendingDto) { return this.service.create(dto); }

  @Get()
  @ApiOkResponse({ description: 'List P2Blending' })
  @ApiQuery({ name: 'lot', required: false })
  @ApiQuery({ name: 'colorId', required: false })
  findAll(@Query('lot') lot?: string, @Query('colorId') colorId?: string) {
    return this.service.findAll({ lot, colorId });
  }

  @Get(':id') @ApiOkResponse({ description: 'Get one P2Blending' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id') @ApiOkResponse({ description: 'Updated' })
  update(@Param('id') id: string, @Body() dto: UpdateP2BlendingDto) { return this.service.update(id, dto); }

  @Delete(':id') @ApiOkResponse({ description: 'Deleted' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
  
}
