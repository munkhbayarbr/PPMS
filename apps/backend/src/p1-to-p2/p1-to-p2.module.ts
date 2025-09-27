import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P1ToP2Controller } from './p1-to-p2.controller';
import { P1ToP2Service } from './p1-to-p2.service';

@Module({
  imports: [PrismaModule],
  controllers: [P1ToP2Controller],
  providers: [P1ToP2Service],
  exports: [P1ToP2Service],
})
export class P1ToP2Module {}
