import { Module } from '@nestjs/common';
import { FiberTypesService } from './fiber-types.service';
import { FiberTypesController } from './fiber-types.controller'
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [FiberTypesController],
  providers: [FiberTypesService, PrismaService],
})
export class FiberTypesModule {}
