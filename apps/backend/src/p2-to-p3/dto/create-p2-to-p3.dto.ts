import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateP2ToP3Dto {
  @ApiProperty({ description: "P2 dyeing batch ID" })
  @IsString()
  p2Id: string;

  @ApiProperty({ description: "P3 carding batch ID" })
  @IsString()
  p3Id: string;

  @ApiProperty({ description: "Weight taken from P2 to P3", required: false, example: 120.5 })
  @IsOptional()
  @IsNumber()
  takenWeight?: number;

  @ApiProperty({ description: "Moisture percentage", required: false, example: 10.2 })
  @IsOptional()
  @IsNumber()
  moisture?: number;

  @ApiProperty({ description: "Confirmed taken weight", required: false })
  @IsOptional()
  @IsNumber()
  takenWeightCon?: number;
}
