import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateP7TwistingDto {
  @ApiProperty({
    description: 'Lot number of the material',
    example: 'LOT-2025-005',
  })
  @IsString()
  lotNum!: string;

  @ApiPropertyOptional({
    description: 'Batch number (if applicable)',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  batchNum?: number;

  @ApiPropertyOptional({
    description: 'Date and time of twisting process',
    example: '2025-09-29T18:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @ApiPropertyOptional({
    description: 'Input rough weight (kg)',
    example: 140.0,
  })
  @IsOptional()
  @IsNumber()
  inRoughWeight?: number;

  @ApiPropertyOptional({
    description: 'Output weight of Бэлэн Утас (kg)',
    example: 130.5,
  })
  @IsOptional()
  @IsNumber()
  p5BelenUtas?: number;

  @ApiProperty({
    description: 'ID of the user who performed the twisting process',
    example: 'user_987qwe',
  })
  @IsString()
  userId!: string;

  // Workflow glue (optional)
  @ApiPropertyOptional({
    description: 'Associated order ID',
    example: 'order_222bbb',
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: 'Stage index in the workflow this record belongs to',
    example: 6,
  })
  @IsOptional()
  @IsNumber()
  stageIndex?: number;
}
