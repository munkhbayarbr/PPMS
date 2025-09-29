import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderStageStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
  SKIPPED = 'SKIPPED',
}

export class UpdateOrderStageDto {
  @ApiPropertyOptional({
    description: 'Current status of the stage',
    enum: OrderStageStatus,
    example: OrderStageStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(OrderStageStatus)
  status?: OrderStageStatus;

  @ApiPropertyOptional({
    description: 'Planned quantity for this stage',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  plannedQty?: number;

  @ApiPropertyOptional({
    description: 'Completed quantity for this stage',
    example: 40,
  })
  @IsOptional()
  @IsNumber()
  completedQty?: number;

  @ApiPropertyOptional({
    description: 'User ID of the assigned staff member',
    example: 'user_123abc',
  })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiPropertyOptional({
    description: 'Optional record table name when a concrete record is created (e.g., P3, P4)',
    example: 'production_records',
  })
  @IsOptional()
  @IsString()
  recordTable?: string;

  @ApiPropertyOptional({
    description: 'Optional record ID for the attached concrete record',
    example: 'rec_456def',
  })
  @IsOptional()
  @IsString()
  recordId?: string;
}
