import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFiberTypeDto, UpdateFiberTypeDto } from './dto/fiber-types.dto'

@Injectable()
export class FiberTypesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFiberTypeDto) {
    const exists = await this.prisma.fiberType.findUnique({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Fiber type already exists');

    return this.prisma.fiberType.create({ data: dto });
  }

  async findAll() {
    return this.prisma.fiberType.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const fiber = await this.prisma.fiberType.findUnique({ where: { id } });
    if (!fiber) throw new NotFoundException('Fiber type not found');
    return fiber;
  }

  async update(id: string, dto: UpdateFiberTypeDto) {
    return this.prisma.fiberType.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.fiberType.delete({ where: { id } });
  }
}
