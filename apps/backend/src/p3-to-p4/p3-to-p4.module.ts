import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P3ToP4Service } from './p3-to-p4.service';
import { P3ToP4Controller } from './p3-to-p4.controller';

@Module({
  imports: [PrismaModule],
  providers: [P3ToP4Service],
  controllers: [P3ToP4Controller],
})
export class P3ToP4Module {}
