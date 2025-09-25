import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto, RegisterDto } from './dtos';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private users: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Body() _: LoginDto, @Request() req: any) {
    return this.auth.login(req.user); // req.user comes from LocalStrategy.validate
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.users.create(dto);
    return user;
  }
}
