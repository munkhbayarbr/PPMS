import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ description: 'User ID (uuid/cuid)' })
  @IsString() userId!: string;

  @ApiProperty({ description: 'Role ID (uuid/cuid)' })
  @IsString() roleId!: string;
}
