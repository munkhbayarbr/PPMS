import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P6ToP7Service } from './p6-to-p7.service';
import { P6ToP7Controller } from './p6-to-p7.controller';

@Module({
  imports: [PrismaModule],
  providers: [P6ToP7Service],
  controllers: [P6ToP7Controller],
})
export class P6ToP7Module {}
