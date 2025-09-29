import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateWorkflowTemplateDto } from './dto/create-workflow-template.dto';
import { UpdateWorkflowTemplateDto } from './dto/update-workflow-template.dto';

@Injectable()
export class WorkflowTemplatesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateWorkflowTemplateDto) {
    const { name, isActive = true, stages } = dto;
    return this.prisma.workflowTemplate.create({
      data: {
        name,
        isActive,
        stages: {
          create: stages.map((s) => ({
            orderIndex: s.orderIndex,
            stageCode: s.stageCode as any,
            factoryProcessId: s.factoryProcessId ?? null,
          })),
        },
      },
      include: { stages: true },
    });
  }

  findAll() {
    return this.prisma.workflowTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { stages: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async findOne(id: string) {
    const t = await this.prisma.workflowTemplate.findUnique({
      where: { id },
      include: { stages: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!t) throw new NotFoundException('Template not found');
    return t;
  }

  async update(id: string, dto: UpdateWorkflowTemplateDto) {
    // For simplicity: replace stages if provided
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.workflowTemplate.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Template not found');

      const { stages, ...rest } = dto as any;
      const updated = await tx.workflowTemplate.update({
        where: { id },
        data: rest,
      });

      if (stages) {
        await tx.workflowStageTemplate.deleteMany({
          where: { templateId: id },
        });
        await tx.workflowStageTemplate.createMany({
          data: stages.map((s) => ({
            templateId: id,
            orderIndex: s.orderIndex,
            stageCode: s.stageCode,
            factoryProcessId: s.factoryProcessId ?? null,
          })),
        });
      }

      return tx.workflowTemplate.findUnique({
        where: { id },
        include: { stages: { orderBy: { orderIndex: 'asc' } } },
      });
    });
  }

  remove(id: string) {
    return this.prisma.workflowTemplate.delete({ where: { id } });
  }
}
