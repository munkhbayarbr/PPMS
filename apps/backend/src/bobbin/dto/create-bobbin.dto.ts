import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateBobbinDto {
  @ApiProperty() @IsNotEmpty() name: string;
  @ApiProperty({ example: 0.25 }) @IsNumber() @IsPositive() weight: number; // kg
}
