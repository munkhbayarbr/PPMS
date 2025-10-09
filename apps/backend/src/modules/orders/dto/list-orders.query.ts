import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class ListOrdersQuery {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customer_id?: number;

  @ApiPropertyOptional({ example: '2025-10-01' })
  @IsOptional()
  @IsString()
  from?: string; // ISO date

  @ApiPropertyOptional({ example: '2025-10-31' })
  @IsOptional()
  @IsString()
  to?: string; // ISO date

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 20;

  @ApiPropertyOptional({ example: 'recorded_at:desc', description: 'format: field:asc|desc' })
  @IsOptional()
  @IsString()
  orderBy?: string;
}
