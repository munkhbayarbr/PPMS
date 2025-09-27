import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP3CardingDto } from './dto/create-p3-carding.dto';
import { UpdateP3CardingDto } from './dto/update-p3-carding.dto';

@Injectable()
export class P3CardingService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP3CardingDto) {
    return this.prisma.p3Carding.create({
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p3RovenWeight: dto.p3RovenWeight,
        p3Waste: dto.p3Waste,
        bobbinNum: dto.bobbinNum,
        userId: dto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.p3Carding.findMany({
      include: { operator: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.p3Carding.findUnique({
      where: { id },
      include: { operator: true, fromP2: true, toP4: true },
    });
    if (!item) throw new NotFoundException('P3Carding not found');
    return item;
  }

  update(id: string, dto: UpdateP3CardingDto) {
    return this.prisma.p3Carding.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p3RovenWeight: dto.p3RovenWeight,
        p3Waste: dto.p3Waste,
        bobbinNum: dto.bobbinNum,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p3Carding.delete({ where: { id } });
  }
}
