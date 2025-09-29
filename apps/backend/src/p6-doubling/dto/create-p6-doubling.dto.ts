import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateP6DoublingDto {
  @ApiProperty({
    description: 'Lot number of the material',
    example: 'LOT-2025-004',
  })
  @IsString()
  lotNum!: string;

  @ApiPropertyOptional({
    description: 'Batch number (if applicable)',
    example: 8,
  })
  @IsOptional()
  @IsInt()
  batchNum?: number;

  @ApiPropertyOptional({
    description: 'Date and time of doubling process',
    example: '2025-09-29T17:15:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @ApiPropertyOptional({
    description: 'Input rough weight (kg)',
    example: 175.4,
  })
  @IsOptional()
  @IsNumber()
  inRoughWeight?: number;

  @ApiPropertyOptional({
    description: 'Output weight of Давхар Утас (kg)',
    example: 160.0,
  })
  @IsOptional()
  @IsNumber()
  p5DavharUtas?: number;

  @ApiProperty({
    description: 'ID of the user who performed the doubling process',
    example: 'user_123xyz',
  })
  @IsString()
  userId!: string;

  // Workflow glue (optional)
  @ApiPropertyOptional({
    description: 'Associated order ID',
    example: 'order_111aaa',
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: 'Stage index in the workflow this record belongs to',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  stageIndex?: number;
}
