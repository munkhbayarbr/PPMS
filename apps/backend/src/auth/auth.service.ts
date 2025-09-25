import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.isActive)
      throw new UnauthorizedException('Invalid credentials');

    const ok = await this.users.validatePassword(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // strip password
    const { password: _pw, ...safe } = user;
    return safe;
  }

 async login(user: { id: string; email: string; role: string }) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = await this.jwt.signAsync(payload);

  return {
    user,
    accessToken,
  };
}
}
