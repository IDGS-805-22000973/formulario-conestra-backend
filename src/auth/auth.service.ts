import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Debes tener un findByEmail aquí
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(correo: string, pass: string) {
    const user = await this.usersService.findOneByEmail(correo);
    
    // Comparamos contraseña encriptada
    if (user && await bcrypt.compare(pass, user.password)) {
      const payload = { 
        sub: user.id, 
        email: user.correo, 
        role: user.role, 
        sexo: user.sexo // Lo incluimos para que el front lo sepa
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: { nombre: user.nombre, role: user.role, sexo: user.sexo } // Devolvemos solo lo necesario
      };
    }
    throw new UnauthorizedException('Credenciales incorrectas');
  }
}