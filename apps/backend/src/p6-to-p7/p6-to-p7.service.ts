import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP6ToP7Dto } from './dto/create-p6-to-p7.dto';
import { UpdateP6ToP7Dto } from './dto/update-p6-to-p7.dto';

@Injectable()
export class P6ToP7Service {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP6ToP7Dto) {
    return this.prisma.p6ToP7.create({
      data: {
        p6Id: dto.p6Id,
        p7Id: dto.p7Id,
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  upsert(dto: CreateP6ToP7Dto) {
    return this.prisma.p6ToP7.upsert({
      where: { p6Id_p7Id: { p6Id: dto.p6Id, p7Id: dto.p7Id } },
      create: {
        p6Id: dto.p6Id,
        p7Id: dto.p7Id,
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
    return this.prisma.p6ToP7.findMany({
      include: { p6: true, p7: true },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.p6ToP7.findUnique({
      where: { id },
      include: { p6: true, p7: true },
    });
  }

  findByP6(p6Id: string) {
    return this.prisma.p6ToP7.findMany({
      where: { p6Id },
      include: { p7: true },
      orderBy: { id: 'desc' },
    });
  }

  findByP7(p7Id: string) {
    return this.prisma.p6ToP7.findMany({
      where: { p7Id },
      include: { p6: true },
      orderBy: { id: 'desc' },
    });
  }

  update(id: string, dto: UpdateP6ToP7Dto) {
    return this.prisma.p6ToP7.update({
      where: { id },
      data: {
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p6ToP7.delete({ where: { id } });
  }
}
