import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateP3CardingDto {
  @ApiProperty({
    description: 'Lot number of the material',
    example: 'LOT-2025-001',
  })
  @IsString()
  lotNum!: string;

  @ApiPropertyOptional({
    description: 'Batch number (if applicable)',
    example: 12,
  })
  @IsOptional()
  @IsInt()
  batchNum?: number;

  @ApiPropertyOptional({
    description: 'Date and time of carding process',
    example: '2025-09-29T14:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @ApiPropertyOptional({
    description: 'Input rough weight (kg)',
    example: 120.5,
  })
  @IsOptional()
  @IsNumber()
  inRoughWeight?: number;

  @ApiPropertyOptional({
    description: 'Carded roven weight (kg)',
    example: 95.3,
  })
  @IsOptional()
  @IsNumber()
  p3RovenWeight?: number;

  @ApiPropertyOptional({
    description: 'Waste generated during carding (kg)',
    example: 3.2,
  })
  @IsOptional()
  @IsNumber()
  p3Waste?: number;

  @ApiPropertyOptional({
    description: 'Number of bobbins produced',
    example: 45,
  })
  @IsOptional()
  @IsInt()
  bobbinNum?: number;

  @ApiProperty({
    description: 'ID of the user who performed the process',
    example: 'user_123abc',
  })
  @IsString()
  userId!: string;

  // Workflow glue (optional)
  @ApiPropertyOptional({
    description: 'Associated order ID',
    example: 'order_456def',
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: 'Stage index in the workflow this record belongs to',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  stageIndex?: number;
}
