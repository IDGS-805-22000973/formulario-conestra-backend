import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const usersService = app.get(UsersService);

  // Crear usuario admin si no existe
  const correoAdmin = 'admin@test.com';

  const usuarioExistente = await usersService.findOneByEmail(correoAdmin);

  if (!usuarioExistente) {
    await usersService.create({
      nombre: 'Administrador',
      correo: correoAdmin,
      password: '123456',
      edad: 30,
      sexo: 'M',
      role: 'admin',
    });

    console.log('Usuario admin creado automáticamente');
  } else {
    console.log('Usuario admin ya existe');
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Server is running on port ${port}`);
}

bootstrap();