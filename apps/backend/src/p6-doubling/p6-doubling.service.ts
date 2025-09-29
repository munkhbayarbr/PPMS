import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP6DoublingDto } from './dto/create-p6-doubling.dto';
import { UpdateP6DoublingDto } from './dto/update-p6-doubling.dto';
import { WorkflowService } from 'src/workflow/workflow.service';
import { StartStageDto } from 'src/common/dto/start-stage-dto';
import { StageCode, StageStatus, Prisma } from '@prisma/client';
@Injectable()
export class P6DoublingService {
  constructor(
    private prisma: PrismaService,
    private wf: WorkflowService,
  ) {}

  async create(dto: CreateP6DoublingDto) {
    return this.prisma.$transaction(async (tx) => {
      const rec = await tx.p6Doubling.create({
        data: {
          lotNum: dto.lotNum,
          batchNum: dto.batchNum ?? null,
          dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
          inRoughWeight: dto.inRoughWeight as any,
          p5DavharUtas: dto.p5DavharUtas as any,
          userId: dto.userId,
        },
      });

      if (dto.orderId != null && dto.stageIndex != null) {
        await tx.orderStage.update({
          where: {
            orderId_index: {
              orderId: dto.orderId,
              index: Number(dto.stageIndex),
            },
          },
          data: {
            status: StageStatus.DONE,
            recordTable: 'p6_doubling',
            recordId: rec.id,
            finishedAt: new Date(),
          },
        });
      }
      return rec;
    });
  }
  async start(dto: StartStageDto) {
    return this.wf.markStageInProgress(dto.orderId, dto.stageIndex, dto.userId);
  }
  findAll() {
    return this.prisma.p6Doubling.findMany({
      include: { operator: true, fromP5: true, toP7: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.p6Doubling.findUnique({
      where: { id },
      include: { operator: true, fromP5: true, toP7: true },
    });
    if (!row) throw new NotFoundException('P6Doubling not found');
    return row;
  }

  update(id: string, dto: UpdateP6DoublingDto) {
    return this.prisma.p6Doubling.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p5DavharUtas: dto.p5DavharUtas,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p6Doubling.delete({ where: { id } });
  }

  async startStage(orderId: string, stageIndex: number) {
    await this.prisma.orderStage.upsert({
      where: { orderId_index: { orderId, index: stageIndex } },
      update: { status: StageStatus.NOT_STARTED },
      create: {
        orderId,
        index: stageIndex,
        status: StageStatus.NOT_STARTED,
stageCode:'P6'
      },
    });
    return { ok: true };
  }

  async createBatch(
    dto: Prisma.P6DoublingCreateInput & {
      orderId?: string;
      stageIndex?: number;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const rec = await tx.p6Doubling.create({ data: dto });

      if (dto.orderId && dto.stageIndex != null) {
        await tx.orderStage.upsert({
          where: {
            orderId_index: { orderId: dto.orderId, index: dto.stageIndex },
          },
          update: { status:StageStatus.IN_PROGRESS },
          create: {
            orderId: dto.orderId,
            index: dto.stageIndex,
            status: StageStatus.IN_PROGRESS,
            stageCode:'P6'
          },
        });
      }
      return rec;
    });
  }

  async completeStage(orderId: string, stageIndex: number) {
    return this.prisma.orderStage.update({
      where: { orderId_index: { orderId, index: stageIndex } },
      data: { status: 'DONE', finishedAt: new Date() },
    });
  }
}
