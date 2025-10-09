import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Nomadic Textile LLC' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'NomTex', required: false })
  @IsOptional()
  @IsString()
  abb_name?: string;

  @ApiProperty({ example: 'info@nomtex.mn', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '99998888', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ example: 'Ulaanbaatar, Mongolia', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '77778888', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '70108888', required: false })
  @IsOptional()
  @IsString()
  fax?: string;
}
