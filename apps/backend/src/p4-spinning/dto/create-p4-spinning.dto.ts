import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateP4SpinningDto {
  @ApiProperty({
    description: 'Lot number of the material',
    example: 'LOT-2025-002',
  })
  @IsString()
  lotNum!: string;

  @ApiPropertyOptional({
    description: 'Batch number (if applicable)',
    example: 7,
  })
  @IsOptional()
  @IsInt()
  batchNum?: number;

  @ApiPropertyOptional({
    description: 'Date and time of spinning process',
    example: '2025-09-29T15:45:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @ApiPropertyOptional({
    description: 'Input rough weight (kg)',
    example: 150.0,
  })
  @IsOptional()
  @IsNumber()
  inRoughWeight?: number;

  @ApiPropertyOptional({
    description: 'Output weight of Dan Utas (kg)',
    example: 110.5,
  })
  @IsOptional()
  @IsNumber()
  p4DanUtas?: number;

  @ApiPropertyOptional({
    description: 'Spun roven weight (kg)',
    example: 98.4,
  })
  @IsOptional()
  @IsNumber()
  p4RovenWeight?: number;

  @ApiPropertyOptional({
    description: 'Waste generated during spinning (kg)',
    example: 5.6,
  })
  @IsOptional()
  @IsNumber()
  p4Waste?: number;

  @ApiProperty({
    description: 'ID of the user who performed the process',
    example: 'user_789ghi',
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
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  stageIndex?: number;
}
