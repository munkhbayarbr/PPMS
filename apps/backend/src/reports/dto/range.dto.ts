import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class RangeDto {
  @ApiPropertyOptional({ example: '2025-09-01T00:00:00.000Z' })
  @IsOptional() @IsISO8601()
  from?: string;

  @ApiPropertyOptional({ example: '2025-09-30T23:59:59.999Z' })
  @IsOptional() @IsISO8601()
  to?: string;
}
