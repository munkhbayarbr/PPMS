import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFiberTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class UpdateFiberTypeDto {
  @ApiProperty()
  name?: string;
}
