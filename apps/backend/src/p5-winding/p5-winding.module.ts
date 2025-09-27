import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P5WindingService } from './p5-winding.service';
import { P5WindingController } from './p5-winding.controller';

@Module({
  imports: [PrismaModule],
  providers: [P5WindingService],
  controllers: [P5WindingController],
})
export class P5WindingModule {}
