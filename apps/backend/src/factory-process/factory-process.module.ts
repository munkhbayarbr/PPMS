import { Module } from '@nestjs/common';
import { FactoryProcessService } from './factory-process.service';
import { FactoryProcessController } from './factory-process.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FactoryProcessController],
  providers: [FactoryProcessService],
})
export class FactoryProcessModule {}
