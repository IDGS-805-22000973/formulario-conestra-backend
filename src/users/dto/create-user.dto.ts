export class CreateUserDto {
  nombre: string;
  correo: string;
  password?: string; // Opcional si decides generarla automáticamente
  edad: number;
  sexo: 'M' | 'F';
  role?: string;
}