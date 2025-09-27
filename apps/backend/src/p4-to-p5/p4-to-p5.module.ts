import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P4ToP5Service } from './p4-to-p5.service';
import { P4ToP5Controller } from './p4-to-p5.controller';

@Module({
  imports: [PrismaModule],
  providers: [P4ToP5Service],
  controllers: [P4ToP5Controller],
})
export class P4ToP5Module {}
