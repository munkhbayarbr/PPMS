import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP5WindingDto } from './dto/create-p5-winding.dto';
import { UpdateP5WindingDto } from './dto/update-p5-winding.dto';
import { WorkflowService } from 'src/workflow/workflow.service';
import { StartStageDto } from 'src/common/dto/start-stage-dto';
import { StageCode,StageStatus,Prisma } from '@prisma/client';
@Injectable()
export class P5WindingService {
  constructor(private prisma: PrismaService, private wf: WorkflowService) {}

  async create(dto: CreateP5WindingDto) {
    return this.prisma.$transaction(async tx => {
      const rec = await tx.p5Winding.create({
        data: {
          lotNum: dto.lotNum,
          batchNum: dto.batchNum ?? null,
          dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
          inRoughWeight: dto.inRoughWeight as any,
          p5OroosonUtas: dto.p5OroosonUtas as any,
          userId: dto.userId,
        },
      });

      if (dto.orderId != null && dto.stageIndex != null) {
        await tx.orderStage.update({
          where: { orderId_index: { orderId: dto.orderId, index: Number(dto.stageIndex) } },
          data: {
            status: StageStatus.DONE,
            recordTable: 'p5_winding',
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
    return this.prisma.p5Winding.findMany({
      include: { operator: true, fromP4: true, toP6: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.p5Winding.findUnique({
      where: { id },
      include: { operator: true, fromP4: true, toP6: true },
    });
    if (!row) throw new NotFoundException('P5Winding not found');
    return row;
  }

  update(id: string, dto: UpdateP5WindingDto) {
    return this.prisma.p5Winding.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p5OroosonUtas: dto.p5OroosonUtas,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p5Winding.delete({ where: { id } });
  }
    async startStage(orderId: string, stageIndex: number) {
    await this.prisma.orderStage.upsert({
      where: { orderId_index: { orderId, index: stageIndex } },
      update: { status: StageStatus.NOT_STARTED },
      create: { orderId, index: stageIndex, status: StageStatus.NOT_STARTED, stageCode:'P5'
       },
    });
    return { ok: true };
  }

  async createBatch(
    dto: Prisma.P5WindingCreateInput & { orderId?: string; stageIndex?: number }
  ) {
    return this.prisma.$transaction(async tx => {
      const rec = await tx.p5Winding.create({ data: dto });

      if (dto.orderId && dto.stageIndex != null) {
        await tx.orderStage.upsert({
          where: { orderId_index: { orderId: dto.orderId, index: dto.stageIndex } },
          update: { status: StageStatus.IN_PROGRESS },
          create: { orderId: dto.orderId, index: dto.stageIndex, status: StageStatus.IN_PROGRESS, stageCode:'P5' },
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
