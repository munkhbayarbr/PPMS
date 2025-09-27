import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP5WindingDto } from './dto/create-p5-winding.dto';
import { UpdateP5WindingDto } from './dto/update-p5-winding.dto';

@Injectable()
export class P5WindingService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP5WindingDto) {
    return this.prisma.p5Winding.create({
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p5OroosonUtas: dto.p5OroosonUtas,
        userId: dto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.p5Winding.findMany({
      include: { operator: true, fromP4: true, toP6: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.p5Winding.findUnique({
      where: { id },
      include: { operator: true, fromP4: true, toP6: true },
    });
    if (!row) throw new NotFoundException('P5Winding not found');
    return row;
  }

  update(id: string, dto: UpdateP5WindingDto) {
    return this.prisma.p5Winding.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p5OroosonUtas: dto.p5OroosonUtas,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p5Winding.delete({ where: { id } });
  }
}
