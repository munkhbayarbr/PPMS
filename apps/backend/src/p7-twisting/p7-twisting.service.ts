import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP7TwistingDto } from './dto/create-p7-twisting.dto';
import { UpdateP7TwistingDto } from './dto/update-p7-twisting.dto';
import { StartStageDto } from 'src/common/dto/start-stage-dto';
import { WorkflowService } from 'src/workflow/workflow.service';
import { StageCode,StageStatus,Prisma } from '@prisma/client';
@Injectable()
export class P7TwistingService {
   constructor(private prisma: PrismaService, private wf: WorkflowService) {}

  async create(dto: CreateP7TwistingDto) {
    return this.prisma.$transaction(async tx => {
      const rec = await tx.p7Twisting.create({
        data: {
          lotNum: dto.lotNum,
          batchNum: dto.batchNum ?? null,
          dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
          inRoughWeight: dto.inRoughWeight as any,
          p5BelenUtas: dto.p5BelenUtas as any,
          userId: dto.userId,
        },
      });

      if (dto.orderId != null && dto.stageIndex != null) {
        await tx.orderStage.update({
          where: { orderId_index: { orderId: dto.orderId, index: Number(dto.stageIndex) } },
          data: {
            status: StageStatus.DONE,
            recordTable: 'p7_twisting',
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
    return this.prisma.p7Twisting.findMany({
      include: { operator: true, fromP6: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.p7Twisting.findUnique({
      where: { id },
      include: { operator: true, fromP6: true },
    });
    if (!row) throw new NotFoundException('P7Twisting not found');
    return row;
  }

  update(id: string, dto: UpdateP7TwistingDto) {
    return this.prisma.p7Twisting.update({
      where: { id },
      data: {
        lotNum: dto.lotNum,
        batchNum: dto.batchNum,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        inRoughWeight: dto.inRoughWeight,
        p5BelenUtas: dto.p5BelenUtas,
        userId: dto.userId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.p7Twisting.delete({ where: { id } });
  }
  async startStage(orderId: string, stageIndex: number) {
    await this.prisma.orderStage.upsert({
      where: { orderId_index: { orderId, index: stageIndex } },
      update: { status: StageStatus.NOT_STARTED},
      create: { orderId, index: stageIndex, status: StageStatus.NOT_STARTED, stageCode:'P7' },
    });
    return { ok: true };
  }

  async createBatch(
    dto: Prisma.P7TwistingCreateInput & { orderId?: string; stageIndex?: number }
  ) {
    return this.prisma.$transaction(async tx => {
      const rec = await tx.p7Twisting.create({ data: dto });

      if (dto.orderId && dto.stageIndex != null) {
        await tx.orderStage.upsert({
          where: { orderId_index: { orderId: dto.orderId, index: dto.stageIndex } },
          update: { status: StageStatus.IN_PROGRESS },
          create: { orderId: dto.orderId, index: dto.stageIndex, status: StageStatus.IN_PROGRESS, stageCode:'P7' },
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
