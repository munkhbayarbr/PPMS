import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateP6ToP7Dto {
  @ApiProperty() @IsString() p6Id!: string;
  @ApiProperty() @IsString() p7Id!: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() takenWeight?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() moisture?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() takenWeightCon?: number;
}
