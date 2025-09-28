import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateP2DyeingDto {
  @ApiProperty({
    description: 'Lot number for this dyeing batch',
    example: 'LOT-2025-001',
  })
  @IsString()
  lotNum: string;

  @ApiProperty({
    description: 'Reference to the output color (optional)',
    example: 'cuid_color123',
    required: false,
  })
  @IsOptional()
  @IsString()
  colorId?: string;

  @ApiProperty({
    description: 'Date and time when dyeing occurred',
    example: '2025-09-28T15:50:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @ApiProperty({
    description: 'Input rough weight before dyeing (kg)',
    example: 120.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  inRoughWeight?: number;

  @ApiProperty({
    description: 'Weight of fiber after dyeing (kg)',
    example: 110.2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  p2FiberWeight?: number;

  @ApiProperty({
    description: 'Waste generated during dyeing process (kg)',
    example: 5.3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  p2Waste?: number;

  @ApiProperty({
    description: 'Reference to the user/operator who performed this dyeing',
    example: 'cuid_user123',
  })
  @IsString()
  userId: string;
}
