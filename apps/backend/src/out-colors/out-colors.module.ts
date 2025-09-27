import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { OutColorsService } from './out-colors.service';
import { OutColorsController } from './out-colors.controller';

@Module({
  imports: [PrismaModule],
  controllers: [OutColorsController],
  providers: [OutColorsService],
  exports: [OutColorsService],
})
export class OutColorsModule {}
