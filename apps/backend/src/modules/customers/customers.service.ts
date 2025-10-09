import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany();
  }

  findOne(id: number) {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  create(data: any) {
  return this.prisma.customer.create({ data });
}

update(id: number, data: any) {
  return this.prisma.customer.update({ where: { id }, data });
}

  remove(id: number) {
    return this.prisma.customer.delete({ where: { id } });
  }
}
