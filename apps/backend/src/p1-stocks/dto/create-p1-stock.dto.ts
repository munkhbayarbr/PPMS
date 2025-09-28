import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateP1StockDto {
  @ApiProperty({ description: 'Customer ID (uuid)' })
    @IsString() @IsNotEmpty()
  customerId!: string;

  @ApiProperty({ description: 'FiberType ID (uuid)' })
  @IsString() @IsNotEmpty()
  fiberTypeId!: string;

  @ApiProperty({ description: 'FiberColor ID (uuid)' })
  @IsString() @IsNotEmpty()
  fiberColorId!: string;

  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  baleNum!: number;

  @ApiPropertyOptional({ example: 100.5 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  roughWeight?: number;

  @ApiPropertyOptional({ example: 98.2 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  baleWeight?: number;

  @ApiPropertyOptional({ example: 97.6 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  conWeight?: number;

  @ApiPropertyOptional({ example: 12.3 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  moisture?: number;

 @ApiProperty()
  @IsString() @IsNotEmpty()
  userId!: string;   // <-- NEW, required

  // If your schema has dateTime (timestamp), you can allow client to send it, otherwise omit this:
  // @ApiPropertyOptional()
  // @IsOptional()
  // @Type(() => Date)
  // dateTime?: Date;
}
