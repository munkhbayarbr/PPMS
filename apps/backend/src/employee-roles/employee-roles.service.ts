import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class EmployeeRolesService {
  constructor(private prisma: PrismaService) {}

  assign(dto: AssignRoleDto) {
    return this.prisma.employeeRole.upsert({
      where: { userId_roleId: { userId: dto.userId, roleId: dto.roleId } },
      create: { userId: dto.userId, roleId: dto.roleId },
      update: {}, // idempotent
    });
  }

  unassign(userId: string, roleId: string) {
    return this.prisma.employeeRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });
  }

  byUser(userId: string) {
    return this.prisma.employeeRole.findMany({
      where: { userId },
      include: { role: true },
      orderBy: { role: { nameEn: 'asc' } },
    });
  }

  byRole(roleId: string) {
    return this.prisma.employeeRole.findMany({
      where: { roleId },
      include: { user: true },
    });
  }
}
