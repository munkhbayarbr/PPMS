import { Module } from '@nestjs/common';
import { P1StocksService } from './p1-stocks.service';
import { P1StocksController } from './p1-stocks.controller';

@Module({
  controllers: [P1StocksController],
  providers: [P1StocksService],
})
export class P1StocksModule {}
