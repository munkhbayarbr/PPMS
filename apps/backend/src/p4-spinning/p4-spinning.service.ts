import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP4SpinningDto } from './dto/create-p4-spinning.dto';
import { UpdateP4SpinningDto } from './dto/update-p4-spinning.dto';
import { StartStageDto } from '../common/dto/start-stage-dto';
import { WorkflowService } from 'src/workflow/workflow.service';
import { StageCode,StageStatus,Prisma } from '@prisma/client';
@Injectable()
export class P4SpinningService {
  constructor(private prisma: PrismaService, private wf: WorkflowService) {}

  async create(dto: CreateP4SpinningDto) {
    return this.prisma.$transaction(async tx => {
      const rec = await tx.p4Spinning.create({
        data: {
          lotNum: dto.lotNum,
          batchNum: dto.batchNum ?? null,
          dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
          inRoughWeight: dto.inRoughWeight as any,
          p4DanUtas: dto.p4DanUtas as any,
          p4RovenWeight: dto.p4RovenWeight as any,
          p4Waste: dto.p4Waste as any,
          userId: dto.userId,
        },
      });

      if (dto.orderId != null && dto.stageIndex != null) {
        await tx.orderStage.update({
          where: { orderId_index: { orderId: dto.orderId, index: Number(dto.stageIndex) } },
          data: {
            status: StageStatus.DONE,
            recordTable: 'p4_spinning',
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
    return this.prisma.p4Spinning.findMany({
      include: { operator: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.p4Spinning.findUnique({
      where: { id },
      include: { operator: true, fromP3: true, toP5: true },
    });
    if (!row) throw new NotFoundException('P4Spinning not found');
    return row;
  }

  update(id: string, dto: UpdateP4SpinningDto) {
    return this.prisma.p4Spinning.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p4DanUtas: dto.p4DanUtas,
        p4RovenWeight: dto.p4RovenWeight,
        p4Waste: dto.p4Waste,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p4Spinning.delete({ where: { id } });
  }
   async startStage(orderId: string, stageIndex: number) {
    await this.prisma.orderStage.upsert({
      where: { orderId_index: { orderId, index: stageIndex } },
      update: { status: StageStatus.NOT_STARTED },
      create: { orderId, index: stageIndex, status: StageStatus.NOT_STARTED, stageCode:'P4'},
    });
    return { ok: true };
  }

  async createBatch(
    dto: Prisma.P4SpinningCreateInput & { orderId?: string; stageIndex?: number }
  ) {
    return this.prisma.$transaction(async tx => {
      const rec = await tx.p4Spinning.create({ data: dto });

      if (dto.orderId && dto.stageIndex != null) {
        await tx.orderStage.upsert({
          where: { orderId_index: { orderId: dto.orderId, index: dto.stageIndex } },
          update: { status: StageStatus.IN_PROGRESS },
          create: { orderId: dto.orderId, index: dto.stageIndex, status: StageStatus.IN_PROGRESS, stageCode:'P4' },
        });
      }
      return rec;
    });
  }

  async completeStage(orderId: string, stageIndex: number) {
    return this.prisma.orderStage.update({
      where: { orderId_index: { orderId, index: stageIndex } },
      data: { status:StageStatus.DONE, finishedAt: new Date() },
    });
  }
}
