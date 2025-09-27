import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP5ToP6Dto } from './dto/create-p5-to-p6.dto';
import { UpdateP5ToP6Dto } from './dto/update-p5-to-p6.dto';

@Injectable()
export class P5ToP6Service {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP5ToP6Dto) {
    return this.prisma.p5ToP6.create({
      data: {
        p5Id: dto.p5Id,
        p6Id: dto.p6Id,
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  upsert(dto: CreateP5ToP6Dto) {
    return this.prisma.p5ToP6.upsert({
      where: { p5Id_p6Id: { p5Id: dto.p5Id, p6Id: dto.p6Id } },
      create: {
        p5Id: dto.p5Id,
        p6Id: dto.p6Id,
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
      update: {
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  findAll() {
    return this.prisma.p5ToP6.findMany({
      include: { p5: true, p6: true },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.p5ToP6.findUnique({
      where: { id },
      include: { p5: true, p6: true },
    });
  }

  findByP5(p5Id: string) {
    return this.prisma.p5ToP6.findMany({
      where: { p5Id },
      include: { p6: true },
      orderBy: { id: 'desc' },
    });
  }

  findByP6(p6Id: string) {
    return this.prisma.p5ToP6.findMany({
      where: { p6Id },
      include: { p5: true },
      orderBy: { id: 'desc' },
    });
  }

  update(id: string, dto: UpdateP5ToP6Dto) {
    return this.prisma.p5ToP6.update({
      where: { id },
      data: {
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p5ToP6.delete({ where: { id } });
  }
}
