import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFactoryProcessDto {
  @ApiProperty() @IsNotEmpty() nameEn: string;
  @ApiProperty({ required: false }) @IsOptional() nameMn?: string;
  @ApiProperty({ required: false }) @IsOptional() abbre?: string;
}
