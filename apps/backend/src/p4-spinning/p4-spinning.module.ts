import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P4SpinningService } from './p4-spinning.service';
import { P4SpinningController } from './p4-spinning.controller';

@Module({
  imports: [PrismaModule],
  providers: [P4SpinningService],
  controllers: [P4SpinningController],
})
export class P4SpinningModule {}
