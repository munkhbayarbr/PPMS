import { Module } from '@nestjs/common';
import { BobbinService } from './bobbin.service';
import { BobbinController } from './bobbin.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BobbinController],
  providers: [BobbinService],
})
export class BobbinModule {}
