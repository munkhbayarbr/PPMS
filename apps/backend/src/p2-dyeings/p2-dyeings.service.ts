import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // adjust path if needed
import { CreateP2DyeingDto } from './dto/create-p2-dyeing.dto';
import { UpdateP2DyeingDto } from './dto/update-p2-dyeing.dto';
import { Prisma, StageStatus } from '@prisma/client';

@Injectable()
export class P2DyeingsService {
  constructor(private prisma: PrismaService) {}

  async startStage(orderId: string, stageIndex: number) {
    await this.prisma.orderStage.upsert({
      where: { orderId_index: { orderId, index: stageIndex } },
      update: {

        status: StageStatus.NOT_STARTED,
        stageCode: 'P2',
      },
      create: {
        orderId,
        index: stageIndex,
        status: StageStatus.NOT_STARTED,
        stageCode: 'P2',
      },
    });
    return { ok: true };
  }

  async createBatch(
    dto: (Prisma.P2DyeingCreateInput | Prisma.P2DyeingUncheckedCreateInput) & {
      orderId?: string;
      stageIndex?: number;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Strip out the orchestration extras before creating the P2 record
      const { orderId, stageIndex, ...data } = dto as any;

      const rec = await tx.p2Dyeing.create({
        data: data as Prisma.P2DyeingUncheckedCreateInput, // or CreateInput if you pass nested relations
      });

      if (orderId && stageIndex != null) {
        await tx.orderStage.upsert({
          where: { orderId_index: { orderId, index: stageIndex } },
          update: {
            status: StageStatus.IN_PROGRESS,
            stageCode: 'P2',
          },
          create: {
            orderId,
            index: stageIndex,
            status: StageStatus.IN_PROGRESS,
            stageCode: 'P2',
          },
        });
      }

      return rec;
    });
  }

  async completeStage(orderId: string, stageIndex: number) {
    return this.prisma.orderStage.update({
      where: { orderId_index: { orderId, index: stageIndex } },
      data: {
        status: StageStatus.DONE,
        // finishedAt: new Date(), // <- include only if your OrderStage has this column
        stageCode: 'P2',
      },
    });
  }

  // CRUD

  create(data: CreateP2DyeingDto) {
    return this.prisma.p2Dyeing.create({ data });
  }

  findAll() {
    return this.prisma.p2Dyeing.findMany({
      include: { color: true, operator: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.p2Dyeing.findUnique({
      where: { id },
      include: { color: true, operator: true, fromP1: true, toP3: true },
    });
  }

  update(id: string, data: UpdateP2DyeingDto) {
    return this.prisma.p2Dyeing.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.p2Dyeing.delete({ where: { id } });
  }
}
