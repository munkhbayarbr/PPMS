import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P2DyeingsController } from './p2-dyeings.controller';
import { P2DyeingsService } from './p2-dyeings.service';

@Module({
  imports: [PrismaModule],
  controllers: [P2DyeingsController],
  providers: [P2DyeingsService],
})
export class P2DyeingsModule {}
