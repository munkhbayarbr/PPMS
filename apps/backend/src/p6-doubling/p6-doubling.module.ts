import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P6DoublingService } from './p6-doubling.service';
import { P6DoublingController } from './p6-doubling.controller';

@Module({
  imports: [PrismaModule],
  providers: [P6DoublingService],
  controllers: [P6DoublingController],
})
export class P6DoublingModule {}
