import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateP2BlendingDto {
  @ApiProperty() @IsNotEmpty() lotNum: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() colorId?: string; // OutColor.id
  @ApiProperty({ required: false, example: 100 }) @IsOptional() @IsNumber() inRoughWeight?: number;
  @ApiProperty({ required: false, example: 95 }) @IsOptional() @IsNumber() p2FiberWeight?: number;
  @ApiProperty({ required: false, example: 5 }) @IsOptional() @IsNumber() p2Waste?: number;
  @ApiProperty() @IsUUID() userId: string; // operator
}
