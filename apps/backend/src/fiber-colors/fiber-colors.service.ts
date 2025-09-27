import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFiberColorDto } from './dto/create-fiber-color.dto';
import { UpdateFiberColorDto } from './dto/update-fiber-color.dto';

@Injectable()
export class FiberColorsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateFiberColorDto) {
    return this.prisma.fiberColor.create({ data: { name: dto.name } });
  }

  findAll() {
    return this.prisma.fiberColor.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.fiberColor.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('FiberColor not found');
    return item;
  }

  async update(id: string, dto: UpdateFiberColorDto) {
    await this.findOne(id);
    return this.prisma.fiberColor.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fiberColor.delete({ where: { id } });
  }
}
