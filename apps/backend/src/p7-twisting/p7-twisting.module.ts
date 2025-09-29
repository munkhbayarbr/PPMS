import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { P7TwistingService } from './p7-twisting.service';
import { P7TwistingController } from './p7-twisting.controller';
import { WorkflowModule } from 'src/workflow/workflow.module';

@Module({
  imports: [PrismaModule, WorkflowModule],
  providers: [P7TwistingService],
  controllers: [P7TwistingController],
})
export class P7TwistingModule {}
