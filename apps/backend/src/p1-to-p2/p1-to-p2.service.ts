import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP1ToP2Dto } from './dto/create-p1-to-p2.dto';
import { UpdateP1ToP2Dto } from './dto/update-p1-to-p2.dto';

@Injectable()
export class P1ToP2Service {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP1ToP2Dto) {
    return this.prisma.p1ToP2.create({
      data: {
        p1Id: dto.p1Id,
        p2Id: dto.p2Id,
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
        roughWeight: dto.roughWeight,
      },
    });
  }

  // Optional convenience: upsert by unique pair (p1Id, p2Id)
  upsert(dto: CreateP1ToP2Dto) {
    return this.prisma.p1ToP2.upsert({
      where: { p1Id_p2Id: { p1Id: dto.p1Id, p2Id: dto.p2Id } },
      create: {
        p1Id: dto.p1Id,
        p2Id: dto.p2Id,
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
        roughWeight: dto.roughWeight,
      },
      update: {
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
        roughWeight: dto.roughWeight,
      },
    });
  }

  findAll() {
    return this.prisma.p1ToP2.findMany({
      include: { p1: true, p2: true },
      orderBy: { id: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.p1ToP2.findUnique({
      where: { id },
      include: { p1: true, p2: true },
    });
  }

  findByP1(p1Id: string) {
    return this.prisma.p1ToP2.findMany({
      where: { p1Id },
      include: { p2: true },
      orderBy: { id: 'desc' },
    });
  }

  findByP2(p2Id: string) {
    return this.prisma.p1ToP2.findMany({
      where: { p2Id },
      include: { p1: true },
      orderBy: { id: 'desc' },
    });
  }

  update(id: string, dto: UpdateP1ToP2Dto) {
    return this.prisma.p1ToP2.update({
      where: { id },
      data: {
        // do NOT allow changing the pair via update; keep it stable
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
        roughWeight: dto.roughWeight,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p1ToP2.delete({ where: { id } });
  }

  // If you ever need to delete by pair instead of id:
  removeByPair(p1Id: string, p2Id: string) {
    return this.prisma.p1ToP2.delete({
      where: { p1Id_p2Id: { p1Id, p2Id } },
    });
  }
}
