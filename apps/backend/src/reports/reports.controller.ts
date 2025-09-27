import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { RangeDto } from './dto/range.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('wip')
  @ApiOkResponse({ description: 'Work-in-process counts per stage' })
  wip(@Query() q: RangeDto) {
    const range = { from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined };
    return this.service.wip(range);
    }

  @Get('throughput')
  @ApiOkResponse({ description: 'Throughput (kg) per stage' })
  throughput(@Query() q: RangeDto) {
    const range = { from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined };
    return this.service.throughput(range);
  }

  @Get('waste')
  @ApiOkResponse({ description: 'Waste (kg) per stage' })
  waste(@Query() q: RangeDto) {
    const range = { from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined };
    return this.service.waste(range);
  }
}
