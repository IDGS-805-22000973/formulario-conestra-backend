export class UpdateUserDto {
  nombre?: string;
  correo?: string;
  password?: string;
  edad?: number;
  sexo?: 'M' | 'F';
  role?: string;
}
