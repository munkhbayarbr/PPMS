import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';

import { FiberTypesModule } from './fiberTypes/fiber-types.module';
import { FiberColorsModule } from './fiber-colors/fiber-colors.module';
import { P1StocksModule } from './p1-stocks/p1-stocks.module';

import { OutColorsModule } from './out-colors/out-colors.module';
import { P2DyeingsModule } from './p2-dyeings/p2-dyeings.module';
import { P1ToP2Module } from './p1-to-p2/p1-to-p2.module';

import { P3CardingModule } from './p3-carding/p3-carding.module';
import { P2ToP3Module } from './p2-to-p3/p2-to-p3.module';
import { P4SpinningModule } from './p4-spinning/p4-spinning.module';
import { P3ToP4Module } from './p3-to-p4/p3-to-p4.module';
import { P5WindingModule } from './p5-winding/p5-winding.module';
import { P4ToP5Module } from './p4-to-p5/p4-to-p5.module';
import { P6DoublingModule } from './p6-doubling/p6-doubling.module';
import { P5ToP6Module } from './p5-to-p6/p5-to-p6.module';
import { P7TwistingModule } from './p7-twisting/p7-twisting.module';
import { P6ToP7Module } from './p6-to-p7/p6-to-p7.module';

import { BobbinModule } from './bobbin/bobbin.module';
import { FactoryProcessModule } from './factory-process/factory-process.module';
import { P2BlendingModule } from './p2-blending/p2-blending.module';
import { TraceModule } from './trace/trace.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    FiberTypesModule,
    FiberColorsModule,
    P1StocksModule,
    OutColorsModule,
    P2DyeingsModule,
    P1ToP2Module,
    P3CardingModule,
    P2ToP3Module,
    P4SpinningModule,
    P3ToP4Module,
    P5WindingModule,
    P4ToP5Module,
    P6DoublingModule,
    P5ToP6Module,
    P7TwistingModule,
    P6ToP7Module,
    BobbinModule,
    FactoryProcessModule,
    P2BlendingModule,
    TraceModule,
    ReportsModule,
  ],
})
export class AppModule {}
