import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ListOrdersQuery } from './dto/list-orders.query';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(q: ListOrdersQuery) {
    const {
      status, customer_id, from, to,
      page = 1, pageSize = 20, orderBy,
    } = q;

    const where: Prisma.OrderWhereInput = {
      ...(status ? { status } : {}),
      ...(customer_id ? { customer_id } : {}),
      ...(from || to
        ? {
            recorded_at: {
              gte: from ? new Date(from) : undefined,
              lte: to ? new Date(to) : undefined,
            },
          }
        : {}),
    };

    const [field, dir] = (orderBy || '').split(':');
    const orderArg =
      field && dir
        ? { [field]: dir.toLowerCase() === 'desc' ? 'desc' : 'asc' }
        : { recorded_at: 'desc' as const };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: {
          customer: true,
          steps: { orderBy: { seq: 'asc' } },
          stages: { orderBy: { started_at: 'asc' } },
        },
        orderBy: orderArg,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
      items,
    };
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        steps: { orderBy: { seq: 'asc' } },
        stages: { orderBy: { started_at: 'asc' } },
        outputs: true,
        wastes: true,
        stockMoves: true,
      },
    });
  }

  async create(dto: CreateOrderDto) {
    const { steps, ...rest } = dto;

    return this.prisma.order.create({
      data: {
        ...rest,
        recorded_at: new Date(rest.recorded_at),
        ...(steps?.length
          ? {
              steps: {
                create: steps.map((s) => ({
                  process_id: s.process_id,
                  seq: s.seq,
                  active: s.active ?? true,
                  required: s.required ?? true,
                })),
              },
            }
          : {}),
      },
      include: {
        customer: true,
        steps: { orderBy: { seq: 'asc' } },
      },
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    const { steps, ...rest } = dto;

    // update order fields
    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        ...rest,
        ...(rest.recorded_at ? { recorded_at: new Date(rest.recorded_at) } : {}),
      },
      include: { customer: true },
    });

    // optionally replace route if steps provided
    if (steps) {
      // safest approach: delete + recreate (or you can diff)
      await this.prisma.orderProcess.deleteMany({ where: { order_id: id } });
      if (steps.length) {
        await this.prisma.orderProcess.createMany({
          data: steps.map((s) => ({
            order_id: id,
            process_id: s.process_id,
            seq: s.seq,
            active: s.active ?? true,
            required: s.required ?? true,
          })),
        });
      }
    }

    // return with steps
    return this.findOne(id);
  }

  remove(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }
}
