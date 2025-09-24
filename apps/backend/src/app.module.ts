import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [    PrismaModule,
    HealthModule,
    CustomersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
