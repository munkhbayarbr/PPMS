import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    return user;
  }

  async login(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email, };
    return {
      access_token: await this.jwt.signAsync(payload),
      user: { id: user.id, email: user.email },
    };
  }

  async register(data: { email: string; password: string; name?: string }) {
    const created = await this.users.create(data);
    // login immediately after register (optional)
    const token = await this.jwt.signAsync({ sub: created.id, email: created.email });
    return { access_token: token, user: created };
  }
}
