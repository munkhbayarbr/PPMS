import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, StageStatus, P2Blending, OrderStage } from '@prisma/client';

import { UpdateP2BlendingDto } from 'src/p2-blending/dto/update-p2-blending.dto';
import { CreateP2BlendingDto } from 'src/p2-blending/dto/create-p2-blending.dto';

@Injectable()
export class P2BlendingService {
  constructor(private prisma: PrismaService) {}

  async startStage(orderId: string, stageIndex: number): Promise<{ ok: true }> {
    await this.prisma.orderStage.upsert({
      where: { orderId_index: { orderId, index: stageIndex } },
      update: { status: StageStatus.NOT_STARTED }, // or IN_PROGRESS if you prefer
      create: {
        orderId,
        index: stageIndex,
        status: StageStatus.NOT_STARTED,
        stageCode: 'P2',            // ✅ required by your model
        // name: 'P2 – Blending',   // ❌ remove unless the model has this field
      },
    });
    return { ok: true };
  }

  async createBatch(
    dto: (Prisma.P2BlendingUncheckedCreateInput | Prisma.P2BlendingCreateInput) & {
      orderId?: string;
      stageIndex?: number;
    },
  ): Promise<P2Blending> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const rec = await tx.p2Blending.create({ data: dto as any }); // data is valid either way

      if (dto.orderId && dto.stageIndex != null) {
        await tx.orderStage.upsert({
          where: {
            orderId_index: { orderId: dto.orderId, index: dto.stageIndex },
          },
          create: {
            orderId: dto.orderId,
            index: dto.stageIndex,
            status: StageStatus.NOT_STARTED, // ✅ enum, not string
            stageCode: 'P2',                 // ✅ required
            // name: 'P2 – Blending',        // ❌ remove unless model has it
          },
          update: {
            status: StageStatus.IN_PROGRESS, // ✅ enum
            stageCode: 'P2',                 // allowed to include, harmless
            // name: 'P2 – Blending',        // ❌ remove unless model has it
          },
        });
      }
      return rec;
    });
  }

  async completeStage(orderId: string, stageIndex: number): Promise<OrderStage> {
    return this.prisma.orderStage.update({
      where: { orderId_index: { orderId, index: stageIndex } },
      data: { status: StageStatus.DONE, finishedAt: new Date() }, // ✅ enum member
    });
  }

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
