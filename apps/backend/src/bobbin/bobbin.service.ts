import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBobbinDto } from './dto/create-bobbin.dto';
import { UpdateBobbinDto } from './dto/update-bobbin.dto';

@Injectable()
export class BobbinService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateBobbinDto) {
    return this.prisma.bobbin.create({
      data: { name: dto.name, weight: dto.weight },
    });
  }

  findAll() {
    return this.prisma.bobbin.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.bobbin.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateBobbinDto) {
    return this.prisma.bobbin.update({
      where: { id },
      data: { ...dto },
    });
  }

  remove(id: string) {
    return this.prisma.bobbin.delete({ where: { id } });
  }
}
