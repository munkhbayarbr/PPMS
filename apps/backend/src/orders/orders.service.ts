import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStageDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const t = await this.prisma.workflowTemplate.findUnique({
      where: { id: dto.templateId },
      include: { stages: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!t) throw new NotFoundException('Template not found');

    const all = t.stages;
    const start = dto.startIndex ?? 0;
    const end = dto.endIndex ?? (all.length - 1);
    if (start < 0 || end < start || end >= all.length) {
      throw new BadRequestException('Invalid start/end range');
    }

    const slice = all.slice(start, end + 1);
    return this.prisma.$transaction(async tx => {
      const order = await tx.order.create({
        data: {
          code: dto.code,
          templateId: dto.templateId,
          customerId: dto.customerId ?? null,
          startIndex: start,
          endIndex: end,
        },
      });

      await tx.orderStage.createMany({
        data: slice.map((s, i) => ({
          orderId: order.id,
          index: i,
          stageCode: s.stageCode as any,
          status: 'PENDING',
        })),
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: { stages: { orderBy: { index: 'asc' } } },
      });
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { stages: { orderBy: { index: 'asc' } }, customer: true, template: true },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { stages: { orderBy: { index: 'asc' } }, customer: true, template: true },
    });
  }

  async updateStage(orderId: string, stageIndex: number, dto: UpdateOrderStageDto) {
    const os = await this.prisma.orderStage.findUnique({
      where: { orderId_index: { orderId, index: stageIndex } },
    });
    if (!os) throw new NotFoundException('OrderStage not found');

    return this.prisma.orderStage.update({
      where: { orderId_index: { orderId, index: stageIndex } },
      data: {
        status: dto.status ?? os.status,
        plannedQty: dto.plannedQty ?? os.plannedQty,
        completedQty: dto.completedQty ?? os.completedQty,
        assigneeId: dto.assigneeId ?? os.assigneeId,
        recordTable: dto.recordTable ?? os.recordTable,
        recordId: dto.recordId ?? os.recordId,
        startedAt: dto.status === 'IN_PROGRESS' && !os.startedAt ? new Date() : os.startedAt,
        finishedAt: dto.status === 'DONE' && !os.finishedAt ? new Date() : os.finishedAt,
      },
    });
  }
}
