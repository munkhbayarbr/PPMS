import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateP2DyeingDto } from './dto/create-p2-dyeing.dto';
import { UpdateP2DyeingDto } from './dto/update-p2-dyeing.dto';

@Injectable()
export class P2DyeingsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateP2DyeingDto) {
    return this.prisma.p2Dyeing.create({ data });
  }

  findAll() {
    return this.prisma.p2Dyeing.findMany({
      include: { color: true, operator: true },
      orderBy: { dateTime: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.p2Dyeing.findUnique({
      where: { id },
      include: { color: true, operator: true, fromP1: true, toP3: true },
    });
  }

  update(id: string, data: UpdateP2DyeingDto) {
    return this.prisma.p2Dyeing.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.p2Dyeing.delete({ where: { id } });
  }
}
