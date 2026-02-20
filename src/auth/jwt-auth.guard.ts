import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Aquí puedes añadir lógica personalizada antes de llamar al guard padre
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Si hay un error o el usuario no existe (token inválido/inexistente)
    if (err || !user) {
      throw err || new UnauthorizedException('No estás autorizado para acceder a esta ruta');
    }
    return user;
  }
}