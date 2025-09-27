import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateP5ToP6Dto {
  @ApiProperty() @IsString() p5Id!: string;
  @ApiProperty() @IsString() p6Id!: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() takenWeight?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() moisture?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() takenWeightCon?: number;
}
