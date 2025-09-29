import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async markStageInProgress(orderId: string, stageIndex: number, startedByUserId?: string) {
    // Guard: don’t re-start if already DONE
    const os = await this.prisma.orderStage.findUnique({
      where: { orderId_index: { orderId, index: stageIndex } },
      select: { status: true },
    });
    if (!os) throw new BadRequestException('OrderStage not found');
    if (os.status === 'DONE') throw new BadRequestException('Stage already completed');

    return this.prisma.orderStage.update({
      where: { orderId_index: { orderId, index: stageIndex } },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        // startedByUserId, // uncomment only if your schema supports it
      },
    });
  }
}
