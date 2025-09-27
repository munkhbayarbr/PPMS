import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP2ToP3Dto } from './dto/create-p2-to-p3.dto';
import { UpdateP2ToP3Dto } from './dto/update-p2-to-p3.dto';

@Injectable()
export class P2ToP3Service {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP2ToP3Dto) {
    return this.prisma.p2ToP3.create({
      data: {
        p2Id: dto.p2Id,
        p3Id: dto.p3Id,
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  upsert(dto: CreateP2ToP3Dto) {
    return this.prisma.p2ToP3.upsert({
      where: { p2Id_p3Id: { p2Id: dto.p2Id, p3Id: dto.p3Id } },
      create: {
        p2Id: dto.p2Id,
        p3Id: dto.p3Id,
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
    return this.prisma.p2ToP3.findMany({
      include: { p2: true, p3: true },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.p2ToP3.findUnique({
      where: { id },
      include: { p2: true, p3: true },
    });
  }

  findByP2(p2Id: string) {
    return this.prisma.p2ToP3.findMany({
      where: { p2Id },
      include: { p3: true },
      orderBy: { id: 'desc' },
    });
  }

  findByP3(p3Id: string) {
    return this.prisma.p2ToP3.findMany({
      where: { p3Id },
      include: { p2: true },
      orderBy: { id: 'desc' },
    });
  }

  update(id: string, dto: UpdateP2ToP3Dto) {
    return this.prisma.p2ToP3.update({
      where: { id },
      data: {
        takenWeight: dto.takenWeight,
        moisture: dto.moisture,
        takenWeightCon: dto.takenWeightCon,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p2ToP3.delete({ where: { id } });
  }
}
