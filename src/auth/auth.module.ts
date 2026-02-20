import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';

dotenv.config();


@Module({
  imports: [
    UsersModule, // Importamos para buscar usuarios
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Variable de entorno
      signOptions: { expiresIn: '8h' }, // Token válido por una jornada
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }