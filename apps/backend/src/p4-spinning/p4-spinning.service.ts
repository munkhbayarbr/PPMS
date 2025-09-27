import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP4SpinningDto } from './dto/create-p4-spinning.dto';
import { UpdateP4SpinningDto } from './dto/update-p4-spinning.dto';

@Injectable()
export class P4SpinningService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP4SpinningDto) {
    return this.prisma.p4Spinning.create({
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p4DanUtas: dto.p4DanUtas,
        p4RovenWeight: dto.p4RovenWeight,
        p4Waste: dto.p4Waste,
        userId: dto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.p4Spinning.findMany({
      include: { operator: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.p4Spinning.findUnique({
      where: { id },
      include: { operator: true, fromP3: true, toP5: true },
    });
    if (!row) throw new NotFoundException('P4Spinning not found');
    return row;
  }

  update(id: string, dto: UpdateP4SpinningDto) {
    return this.prisma.p4Spinning.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p4DanUtas: dto.p4DanUtas,
        p4RovenWeight: dto.p4RovenWeight,
        p4Waste: dto.p4Waste,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p4Spinning.delete({ where: { id } });
  }
}
