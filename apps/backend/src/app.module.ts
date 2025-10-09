import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';
@Module({
  imports: [
    PrismaModule,
    CustomersModule,
    OrdersModule
    
  ],
  controllers: [],
})
export class AppModule {}
