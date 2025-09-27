import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateP1StockDto } from './dto/create-p1-stock.dto';
import { UpdateP1StockDto } from './dto/update-p1-stock.dto';

@Injectable()
export class P1StocksService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateP1StockDto) {
    return this.prisma.p1Stock.create({
      data: {
        customerId: dto.customerId,
        fiberTypeId: dto.fiberTypeId,
        fiberColorId: dto.fiberColorId,
        baleNum: dto.baleNum,
        roughWeight: dto.roughWeight,
        baleWeight: dto.baleWeight,
        conWeight: dto.conWeight,
        moisture: dto.moisture,
        userId: dto.userId, 
        // dateTime: dto.dateTime, // only if your model has it and you want to allow overrides
      },
    });
  }

  findAll() {
    // If your model has `dateTime`, order by it; otherwise remove orderBy.
    return this.prisma.p1Stock.findMany({
      orderBy: { dateTime: 'desc' }, // <-- use existing timestamp field
      include: {
        customer: { select: { id: true, name: true } },
        fiberType: { select: { id: true, name: true } },
        fiberColor: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.p1Stock.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true } },
        fiberType: { select: { id: true, name: true } },
        fiberColor: { select: { id: true, name: true } },
      },
    });
    if (!item) throw new NotFoundException('P1Stock not found');
    return item;
  }

  async update(id: string, dto: UpdateP1StockDto) {
    await this.findOne(id);
    return this.prisma.p1Stock.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.p1Stock.delete({ where: { id } });
  }
}
