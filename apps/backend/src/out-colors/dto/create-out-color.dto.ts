import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOutColorDto {
  @ApiProperty({ example: 'Sky Blue' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'SKY', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  abbName?: string;
}
