import { Module } from '@nestjs/common';
import { FiberColorsService } from './fiber-colors.service';
import { FiberColorsController } from './fiber-colors.controller';

@Module({
  controllers: [FiberColorsController],
  providers: [FiberColorsService],
})
export class FiberColorsModule {}
