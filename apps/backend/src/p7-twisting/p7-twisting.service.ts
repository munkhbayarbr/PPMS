import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP7TwistingDto } from './dto/create-p7-twisting.dto';
import { UpdateP7TwistingDto } from './dto/update-p7-twisting.dto';

@Injectable()
export class P7TwistingService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP7TwistingDto) {
    return this.prisma.p7Twisting.create({
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p5BelenUtas: dto.p5BelenUtas,
        userId: dto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.p7Twisting.findMany({
      include: { operator: true, fromP6: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.p7Twisting.findUnique({
      where: { id },
      include: { operator: true, fromP6: true },
    });
    if (!row) throw new NotFoundException('P7Twisting not found');
    return row;
  }

  update(id: string, dto: UpdateP7TwistingDto) {
    return this.prisma.p7Twisting.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p5BelenUtas: dto.p5BelenUtas,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p7Twisting.delete({ where: { id } });
  }
}
