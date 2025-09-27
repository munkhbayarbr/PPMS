import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @MinLength(6) password: string;
  @ApiProperty({ required: false }) @IsOptional() name?: string;
  // @ApiProperty({ enum: Role, required: false }) @IsOptional() @IsEnum(Role) role?: Role; // ADMIN/MANAGER/WORKER
}

export class LoginDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() @MinLength(6) password: string;
}
