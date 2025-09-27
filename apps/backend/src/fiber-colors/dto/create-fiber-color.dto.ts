import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateFiberColorDto {
  @ApiProperty({ example: 'Dark Brown' })
  @IsNotEmpty()
  @MaxLength(64)
  name!: string;
}
