import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P2BlendingService } from './p2-blending.service';
import { P2BlendingController } from './p2-blending.controller';

@Module({
  imports: [PrismaModule],
  controllers: [P2BlendingController],
  providers: [P2BlendingService],
})
export class P2BlendingModule {}
