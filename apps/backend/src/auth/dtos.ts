import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty() email: string;
  @ApiProperty() @IsNotEmpty() @MinLength(6) password: string;
}

export class RegisterDto {
  @ApiProperty() email: string;
  @ApiProperty() @MinLength(6) password: string;
  @ApiProperty({ required: false }) @IsOptional() name?: string;
}
