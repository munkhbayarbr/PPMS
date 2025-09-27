import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateP3CardingDto {
  @ApiProperty() @IsString() lotNum!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() batchNum?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() dateTime?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() inRoughWeight?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() p3RovenWeight?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() p3Waste?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsInt() bobbinNum?: number;

  @ApiProperty() @IsString() userId!: string; // operator
}
