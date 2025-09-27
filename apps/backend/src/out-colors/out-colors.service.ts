import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOutColorDto } from './dto/create-out-color.dto';
import { UpdateOutColorDto } from './dto/update-out-color.dto';

@Injectable()
export class OutColorsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOutColorDto) {
    return this.prisma.outColor.create({
      data: {
        name: dto.name,
        abbName: dto.abbName ?? null,
      },
      select: { id: true, name: true, abbName: true },
    });
  }

  async findAll(params: { q?: string; skip?: number; take?: number }) {
    const { q, skip = 0, take = 20 } = params;
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { abbName: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.outColor.findMany({

        skip,
        take,
        orderBy: { name: 'asc' },
        select: { id: true, name: true, abbName: true },
      }),
      this.prisma.outColor.count({  }),
    ]);

    return { items, total, skip, take };
  }

  async findOne(id: string) {
    const row = await this.prisma.outColor.findUnique({
      where: { id },
      select: { id: true, name: true, abbName: true },
    });
    if (!row) throw new NotFoundException('OutColor not found');
    return row;
  }

  async update(id: string, dto: UpdateOutColorDto) {
    // ensure existence for 404 semantics
    await this.findOne(id);
    return this.prisma.outColor.update({
      where: { id },
      data: {
        name: dto.name,
        abbName: dto.abbName ?? null,
      },
      select: { id: true, name: true, abbName: true },
    });
  }

  async remove(id: string) {
    // ensure existence for 404 semantics
    await this.findOne(id);
    await this.prisma.outColor.delete({ where: { id } });
    return { success: true };
  }
}
