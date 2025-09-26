import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FiberTypesController } from './fiberTypes/fiber-types.controller';
import { FiberTypesModule } from './fiberTypes/fiber-types.module';

@Module({
  imports: [
    PrismaModule,
    CustomersModule,
    AuthModule,
    UsersModule,
    FiberTypesModule
  ],
})
export class AppModule {}
