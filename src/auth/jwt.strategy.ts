import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'CLAVE_SECRETA_SUPER_SEGURA', // Usa variables de entorno en producción
    });
  }

  async validate(payload: any) {
    // Lo que retornes aquí se inyectará en el objeto req.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}