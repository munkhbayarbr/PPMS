// customers.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({ data: dto });
    } catch (e) {
      if (isP2002(e, ['email'])) throw new ConflictException('Email already exists');
      throw e;
    }
  }

  async findAll(params?: { q?: string; skip?: number; take?: number }) {
    const { q, skip = 0, take = 20 } = params || {};

    const where: Prisma.CustomerWhereInput | undefined = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { abbName: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { mobile: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q, mode: 'insensitive' } },
            { fax: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined;

    // keep response structure same as before (array), or uncomment wrapper if you want metadata
    return this.prisma.customer.findMany({
      where,
      skip,
      take,
      // no orderBy since your model has no timestamps; add one if you want stable sort (e.g., name)
      orderBy: { name: 'asc' },
    });

    // If you later want metadata:
    // const [data, total] = await this.prisma.$transaction([
    //   this.prisma.customer.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
    //   this.prisma.customer.count({ where }),
    // ]);
    // return { data, total, skip, take };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    try {
      return await this.prisma.customer.update({ where: { id }, data: dto });
    } catch (e) {
      if (isP2025(e)) throw new NotFoundException('Customer not found');
      if (isP2002(e, ['email'])) throw new ConflictException('Email already exists');
      throw e;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.customer.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      if (isP2025(e)) throw new NotFoundException('Customer not found');
      throw e;
    }
  }
}

// ---- helpers ----
function isP2025(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025';
}
function isP2002(e: unknown, fields?: string[]) {
  if (!(e instanceof Prisma.PrismaClientKnownRequestError) || e.code !== 'P2002') return false;
  if (!fields || !Array.isArray((e.meta as any)?.target)) return true;
  const target = (e.meta as any).target as string[];
  return fields.every(f => target.includes(f));
}
