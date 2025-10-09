import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

class OrderStepDto {
  @ApiProperty({ example: 3, description: 'Factory process ID (FK to factory_process.id)' })
  @IsInt()
  process_id: number;

  @ApiProperty({ example: 1, description: 'Execution order in the route' })
  @IsInt()
  @Min(1)
  seq: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean = true;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  required?: boolean = true;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'ORD-001', description: 'Human friendly order number (unique)' })
  @IsString()
  order_no: string;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  @IsInt()
  customer_id: number;

  @ApiProperty({ example: '2025-10-09T09:00:00.000Z' })
  @IsDateString()
  recorded_at: string;

  @ApiPropertyOptional({ example: 'white' })
  @IsOptional()
  @IsString()
  color_id?: string;

  @ApiPropertyOptional({ example: 1200.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight_kg?: number;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.DRAFT })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus = OrderStatus.DRAFT;

  @ApiPropertyOptional({ example: 5, description: 'Responsible manager (employee.id)' })
  @IsOptional()
  @IsInt()
  owner_id?: number;

  @ApiPropertyOptional({
    type: [OrderStepDto],
    description: 'Optional route definition for this order',
    example: [
      { process_id: 1, seq: 1, active: true, required: true },
      { process_id: 2, seq: 2 },
      { process_id: 3, seq: 3 }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderStepDto)
  steps?: OrderStepDto[];
}
