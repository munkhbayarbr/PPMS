import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP3ToP4Dto } from './dto/create-p3-to-p4.dto';
import { UpdateP3ToP4Dto } from './dto/update-p3-to-p4.dto';

@Injectable()
export class P3ToP4Service {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP3ToP4Dto) {
    return this.prisma.p3ToP4.create({
      data: {
        p3Id: dto.p3Id,
        p4Id: dto.p4Id,
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  upsert(dto: CreateP3ToP4Dto) {
    return this.prisma.p3ToP4.upsert({
      where: { p3Id_p4Id: { p3Id: dto.p3Id, p4Id: dto.p4Id } },
      create: {
        p3Id: dto.p3Id,
        p4Id: dto.p4Id,
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
    return this.prisma.p3ToP4.findMany({
      include: { p3: true, p4: true },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.p3ToP4.findUnique({
      where: { id },
      include: { p3: true, p4: true },
    });
  }

  findByP3(p3Id: string) {
    return this.prisma.p3ToP4.findMany({
      where: { p3Id },
      include: { p4: true },
      orderBy: { id: 'desc' },
    });
  }

  findByP4(p4Id: string) {
    return this.prisma.p3ToP4.findMany({
      where: { p4Id },
      include: { p3: true },
      orderBy: { id: 'desc' },
    });
  }

  update(id: string, dto: UpdateP3ToP4Dto) {
    return this.prisma.p3ToP4.update({
      where: { id },
      data: {
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p3ToP4.delete({ where: { id } });
  }
}
