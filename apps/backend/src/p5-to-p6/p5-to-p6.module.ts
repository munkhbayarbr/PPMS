import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P5ToP6Service } from './p5-to-p6.service';
import { P5ToP6Controller } from './p5-to-p6.controller';

@Module({
  imports: [PrismaModule],
  providers: [P5ToP6Service],
  controllers: [P5ToP6Controller],
})
export class P5ToP6Module {}
