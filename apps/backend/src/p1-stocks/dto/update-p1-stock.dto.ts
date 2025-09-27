import { PartialType } from '@nestjs/swagger';
import { CreateP1StockDto } from './create-p1-stock.dto';
export class UpdateP1StockDto extends PartialType(CreateP1StockDto) {}
