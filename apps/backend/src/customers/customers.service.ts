import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({ data: dto });
  }

  findAll(params?: { q?: string; skip?: number; take?: number }) {
    const { q, skip = 0, take = 20 } = params || {};
    return this.prisma.customer.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
    // If you want orders included later:
    // return this.prisma.customer.findUnique({ where: { id }, include: { orders: true } });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    try {
      return await this.prisma.customer.update({ where: { id }, data: dto });
    } catch {
      throw new NotFoundException('Customer not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.customer.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException('Customer not found');
    }
  }
}
