import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    CustomersModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
