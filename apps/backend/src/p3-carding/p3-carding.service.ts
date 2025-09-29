/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP3CardingDto } from './dto/create-p3-carding.dto';
import { UpdateP3CardingDto } from './dto/update-p3-carding.dto';
import { Prisma, StageStatus, P2Blending, OrderStage } from '@prisma/client';
@Injectable()
export class P3CardingService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP3CardingDto) {
    return this.prisma.p3Carding.create({
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p3RovenWeight: dto.p3RovenWeight,
        p3Waste: dto.p3Waste,
        bobbinNum: dto.bobbinNum,
        userId: dto.userId,
      },
    });
  }
 async startStage(orderId: string, stageIndex: number) {
    await this.prisma.orderStage.upsert({
      where: { orderId_index: { orderId, index: stageIndex } },
      update: { status: StageStatus.NOT_STARTED },
      create: { orderId, index: stageIndex, status: StageStatus.NOT_STARTED, stageCode:'P3' },
    });
    return { ok: true };
  }

  async createBatch(
    dto: Prisma.P3CardingCreateInput & { orderId?: string; stageIndex?: number }
  ) {
    return this.prisma.$transaction(async tx => {
      const rec = await tx.p3Carding.create({ data: dto });

      if (dto.orderId && dto.stageIndex != null) {
        await tx.orderStage.upsert({
          where: { orderId_index: { orderId: dto.orderId, index: dto.stageIndex } },
          update: { status: StageStatus.IN_PROGRESS },
          create: { orderId: dto.orderId, index: dto.stageIndex, status: StageStatus.IN_PROGRESS, stageCode:'P3' },
        });
      }
      return rec;
    });
  }

  async completeStage(orderId: string, stageIndex: number) {
    return this.prisma.orderStage.update({
      where: { orderId_index: { orderId, index: stageIndex } },
      data: { status: StageStatus.DONE, finishedAt: new Date() },
    });
  }


  findAll() {
    return this.prisma.p3Carding.findMany({
      include: { operator: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.p3Carding.findUnique({
      where: { id },
      include: { operator: true, fromP2: true, toP4: true },
    });
    if (!item) throw new NotFoundException('P3Carding not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return item;
  }

  update(id: string, dto: UpdateP3CardingDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.p3Carding.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p3RovenWeight: dto.p3RovenWeight,
        p3Waste: dto.p3Waste,
        bobbinNum: dto.bobbinNum,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.p3Carding.delete({ where: { id } });
  }
}
