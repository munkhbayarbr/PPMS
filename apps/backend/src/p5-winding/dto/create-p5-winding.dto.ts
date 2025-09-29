import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateP5WindingDto {
  @ApiProperty({
    description: 'Lot number of the material',
    example: 'LOT-2025-003',
  })
  @IsString()
  lotNum!: string;

  @ApiPropertyOptional({
    description: 'Batch number (if applicable)',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  batchNum?: number;

  @ApiPropertyOptional({
    description: 'Date and time of winding process',
    example: '2025-09-29T16:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @ApiPropertyOptional({
    description: 'Input rough weight (kg)',
    example: 200.5,
  })
  @IsOptional()
  @IsNumber()
  inRoughWeight?: number;

  @ApiPropertyOptional({
    description: 'Output weight of Orooson Utas (kg)',
    example: 180.2,
  })
  @IsOptional()
  @IsNumber()
  p5OroosonUtas?: number;

  @ApiProperty({
    description: 'ID of the user who performed the winding process',
    example: 'user_456xyz',
  })
  @IsString()
  userId!: string;

  // Workflow glue (optional)
  @ApiPropertyOptional({
    description: 'Associated order ID',
    example: 'order_789abc',
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: 'Stage index in the workflow this record belongs to',
    example: 4,
  })
  @IsOptional()
  @IsNumber()
  stageIndex?: number;
}
