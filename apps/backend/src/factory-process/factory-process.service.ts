import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateFactoryProcessDto } from './dto/create-factory-process.dto';
import { UpdateFactoryProcessDto } from './dto/update-factory-process.dto';

@Injectable()
export class FactoryProcessService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateFactoryProcessDto) {
    return this.prisma.factoryProcess.create({ data: { ...dto } });
  }
  findAll() {
    return this.prisma.factoryProcess.findMany({ orderBy: { nameEn: 'asc' } });
  }
  findOne(id: string) {
    return this.prisma.factoryProcess.findUnique({ where: { id } });
  }
  update(id: string, dto: UpdateFactoryProcessDto) {
    return this.prisma.factoryProcess.update({ where: { id }, data: { ...dto } });
  }
  remove(id: string) {
    return this.prisma.factoryProcess.delete({ where: { id } });
  }
}
