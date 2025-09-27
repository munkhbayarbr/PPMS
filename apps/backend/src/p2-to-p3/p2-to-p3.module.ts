import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P2ToP3Service } from './p2-to-p3.service';
import { P2ToP3Controller } from './p2-to-p3.controller';

@Module({
  imports: [PrismaModule],
  providers: [P2ToP3Service],
  controllers: [P2ToP3Controller],
})
export class P2ToP3Module {}
