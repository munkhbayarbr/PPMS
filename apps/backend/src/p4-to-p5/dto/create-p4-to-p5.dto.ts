import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateP4ToP5Dto {
  @ApiProperty() @IsString() p4Id!: string;
  @ApiProperty() @IsString() p5Id!: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() takenWeight?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() moisture?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() takenWeightCon?: number;
}
