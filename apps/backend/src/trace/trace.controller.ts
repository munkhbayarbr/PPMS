import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TraceService } from './trace.service';

@ApiTags('trace')
@Controller('trace')
export class TraceController {
  constructor(private readonly service: TraceService) {}

  @Get('lot/:lotNum')
  @ApiOkResponse({ description: 'Full genealogy for the lot number' })
  traceByLot(@Param('lotNum') lotNum: string) {
    return this.service.traceByLot(lotNum);
  }
}
