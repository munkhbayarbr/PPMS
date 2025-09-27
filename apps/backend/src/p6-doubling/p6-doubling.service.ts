import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP6DoublingDto } from './dto/create-p6-doubling.dto';
import { UpdateP6DoublingDto } from './dto/update-p6-doubling.dto';

@Injectable()
export class P6DoublingService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP6DoublingDto) {
    return this.prisma.p6Doubling.create({
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p5DavharUtas: dto.p5DavharUtas,
        userId: dto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.p6Doubling.findMany({
      include: { operator: true, fromP5: true, toP7: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.p6Doubling.findUnique({
      where: { id },
      include: { operator: true, fromP5: true, toP7: true },
    });
    if (!row) throw new NotFoundException('P6Doubling not found');
    return row;
  }

  update(id: string, dto: UpdateP6DoublingDto) {
    return this.prisma.p6Doubling.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p5DavharUtas: dto.p5DavharUtas,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p6Doubling.delete({ where: { id } });
  }
}
