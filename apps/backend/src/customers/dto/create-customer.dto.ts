// dto/create-customer.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ABC Wool LLC' })
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ example: 'ABC' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  abbName?: string;

  @ApiPropertyOptional({ example: 'contact@wool.mn' })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @ApiPropertyOptional({ example: '+976-99112233' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  mobile?: string;

  @ApiPropertyOptional({ example: 'Ulaanbaatar, Khan-Uul, 15-r khoroo' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ example: '+976-77112233' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @ApiPropertyOptional({ example: '+976-11-123456' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  fax?: string;
}
