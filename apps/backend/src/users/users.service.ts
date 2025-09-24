// src/users/users.service.ts
import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt'; // ok if you installed `bcrypt` (native). Otherwise use 'bcryptjs'.

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    if (!email) return null; // avoid prisma error on undefined
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string; name?: string }) {
    if (!data?.email) throw new BadRequestException('Email is required');
    if (!data?.password) throw new BadRequestException('Password is required');

    const exists = await this.findByEmail(data.email);
    if (exists) throw new ConflictException('Email already in use');

    const hash = await bcrypt.hash(data.password, 12);
    try {
      return this.prisma.user.create({
        data: { email: data.email, password: hash, name: data.name ?? null },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
    } catch (e: any) {
      // unique constraint safety net
      if (e?.code === 'P2002') throw new ConflictException('Email already in use');
      throw e;
    }
  }

  async validatePassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }
}
