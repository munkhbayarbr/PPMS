import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { EmployeeRolesService } from './employee-roles.service';
import { EmployeeRolesController } from './employee-roles.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeeRolesController],
  providers: [EmployeeRolesService],
  exports: [EmployeeRolesService],
})
export class EmployeeRolesModule {}
