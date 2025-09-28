import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Unique English key of the role' })
  @IsString() @IsNotEmpty()
  nameEn!: string;

  @ApiPropertyOptional({ example: 'Админ' })
  @IsOptional() @IsString()
  nameMn?: string;
}
