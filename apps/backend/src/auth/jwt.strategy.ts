import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!, // must match the signing secret
    });
  }

  // in jwt.strategy.ts
async validate(payload: { sub: string; email: string; role: string }) {
  console.log('JWT payload', payload); // remove after testing
  return { userId: payload.sub, email: payload.email, role: payload.role };
}

}
