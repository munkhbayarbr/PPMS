import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateP2DyeingDto {
  @IsString()
  lotNum: string;

  @IsOptional()
  @IsString()
  colorId?: string;

  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @IsOptional()
  @IsNumber()
  inRoughWeight?: number;

  @IsOptional()
  @IsNumber()
  p2FiberWeight?: number;

  @IsOptional()
  @IsNumber()
  p2Waste?: number;

  @IsString()
  userId: string;
}
