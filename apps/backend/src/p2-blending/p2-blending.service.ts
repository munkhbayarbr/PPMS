import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP2BlendingDto } from './dto/create-p2-blending.dto';
import { UpdateP2BlendingDto } from './dto/update-p2-blending.dto';

@Injectable()
export class P2BlendingService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP2BlendingDto) {
    return this.prisma.p2Blending.create({ data: { ...dto } });
  }

  findAll(q?: { lot?: string; colorId?: string }) {
    return this.prisma.p2Blending.findMany({
      where: {
        ...(q?.lot ? { lotNum: { contains: q.lot, mode: 'insensitive' } } : {}),
        ...(q?.colorId ? { colorId: q.colorId } : {}),
      },
      include: { color: true, operator: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.p2Blending.findUnique({
      where: { id },
      include: { color: true, operator: true },
    });
  }

  update(id: string, dto: UpdateP2BlendingDto) {
    return this.prisma.p2Blending.update({ where: { id }, data: { ...dto } });
  }

  remove(id: string) {
    return this.prisma.p2Blending.delete({ where: { id } });
  }
}
