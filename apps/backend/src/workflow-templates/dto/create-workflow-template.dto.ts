import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StageDto {
  @ApiProperty({
    description: 'Order of this stage within the workflow (0-based)',
    minimum: 0,
    example: 0,
  })
  @IsInt()
  @Min(0)
  orderIndex!: number;

  @ApiProperty({
    description: 'Process stage code',
    enum: ['P1', 'P2', 'P2B', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'],
    example: 'P4',
    enumName: 'StageCode',
  })
  @IsString()
  @IsIn(['P1', 'P2', 'P2B', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'])
  stageCode!: string;

  @ApiPropertyOptional({
    description: 'Optional factory process ID to bind this stage to',
    example: 'proc_abc123',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  factoryProcessId?: string;
}

export class CreateWorkflowTemplateDto {
  @ApiProperty({
    description: 'Human-readable name of the workflow template',
    example: 'Default Production Flow',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Whether this template is active',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Ordered list of stages defining the workflow',
    type: () => [StageDto],
    example: [
      { orderIndex: 0, stageCode: 'P1' },
      { orderIndex: 1, stageCode: 'P3', factoryProcessId: 'proc_abc123' },
      { orderIndex: 2, stageCode: 'P4' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StageDto)
  stages!: StageDto[];
}
