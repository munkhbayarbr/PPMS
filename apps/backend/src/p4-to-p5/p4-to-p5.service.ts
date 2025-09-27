import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP4ToP5Dto } from './dto/create-p4-to-p5.dto';
import { UpdateP4ToP5Dto } from './dto/update-p4-to-p5.dto';

@Injectable()
export class P4ToP5Service {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP4ToP5Dto) {
    return this.prisma.p4ToP5.create({
      data: {
        p4Id: dto.p4Id,
        p5Id: dto.p5Id,
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  upsert(dto: CreateP4ToP5Dto) {
    return this.prisma.p4ToP5.upsert({
      where: { p4Id_p5Id: { p4Id: dto.p4Id, p5Id: dto.p5Id } },
      create: {
        p4Id: dto.p4Id,
        p5Id: dto.p5Id,
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
    return this.prisma.p4ToP5.findMany({
      include: { p4: true, p5: true },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.p4ToP5.findUnique({
      where: { id },
      include: { p4: true, p5: true },
    });
  }

  findByP4(p4Id: string) {
    return this.prisma.p4ToP5.findMany({
      where: { p4Id },
      include: { p5: true },
      orderBy: { id: 'desc' },
    });
  }

  findByP5(p5Id: string) {
    return this.prisma.p4ToP5.findMany({
      where: { p5Id },
      include: { p4: true },
      orderBy: { id: 'desc' },
    });
  }

  update(id: string, dto: UpdateP4ToP5Dto) {
    return this.prisma.p4ToP5.update({
      where: { id },
      data: {
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p4ToP5.delete({ where: { id } });
  }
}
