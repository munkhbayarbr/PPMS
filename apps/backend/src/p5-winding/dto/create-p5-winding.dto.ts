import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateP5WindingDto {
  @ApiProperty() @IsString() lotNum!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() batchNum?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() dateTime?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() inRoughWeight?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() p5OroosonUtas?: number;
  @ApiProperty() @IsString() userId!: string;
}
