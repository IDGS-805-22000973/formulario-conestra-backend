import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // Exportamos para que otros módulos puedan usarlo
})
export class EmailModule {}
