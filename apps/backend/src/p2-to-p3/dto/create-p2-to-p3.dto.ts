import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateP2ToP3Dto {
  @ApiProperty() @IsString() p2Id!: string;
  @ApiProperty() @IsString() p3Id!: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() takenWeight?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() moisture?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() takenWeightCon?: number;
}
