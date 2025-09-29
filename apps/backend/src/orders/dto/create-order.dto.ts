import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Unique order code',
    example: 'ORDER-2025-001',
  })
  @IsString()
  code!: string;

  @ApiProperty({
    description: 'Workflow template ID to base this order on',
    example: 'tmpl_123abc',
  })
  @IsString()
  templateId!: string;

  @ApiPropertyOptional({
    description: 'Optional customer ID associated with this order',
    example: 'cust_456def',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({
    description: 'Starting stage index (inclusive)',
    minimum: 0,
    example: 0,
  })
  @IsInt()
  @Min(0)
  startIndex!: number;

  @ApiPropertyOptional({
    description:
      'Ending stage index (inclusive). If omitted, defaults to the last stage in the workflow.',
    minimum: 0,
    example: 4,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  endIndex?: number;
}
