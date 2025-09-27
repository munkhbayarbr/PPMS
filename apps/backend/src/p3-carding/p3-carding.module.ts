import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P3CardingService } from './p3-carding.service';
import { P3CardingController } from './p3-carding.controller';

@Module({
  imports: [PrismaModule],
  providers: [P3CardingService],
  controllers: [P3CardingController],
})
export class P3CardingModule {}
