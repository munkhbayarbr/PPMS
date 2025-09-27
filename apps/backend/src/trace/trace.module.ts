import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TraceService } from './trace.service';
import { TraceController } from './trace.controller';

@Module({
  imports: [PrismaModule],
  providers: [TraceService],
  controllers: [TraceController],
})
export class TraceModule {}
