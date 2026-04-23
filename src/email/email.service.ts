import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    // Configurar el transporter de email
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Usa Gmail como servicio de SMTP
      auth: {
        user: this.configService.get<string>('EMAIL_USER'), // Tu correo de Gmail
        pass: this.configService.get<string>('EMAIL_PASSWORD'), // Tu contraseña de aplicación
      },
    });
  }

  async sendTestSubmissionEmail(
    candidateName: string,
    formType: 'MOSS' | '16PF',
  ): Promise<boolean> {
    try {
      const recipientEmail = 'erika.argaez@conestra.mx';
      const subject = `Nueva respuesta de formulario - ${formType}`;
      const htmlContent = `
        <h2>Nueva Respuesta de Formulario</h2>
        <p><strong>Candidato:</strong> ${candidateName}</p>
        <p><strong>Formulario respondido:</strong> ${formType}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</p>
      `;

      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
      });

      console.log('Correo enviado:', info.response);
      return true;
    } catch (error) {
      console.error('Error al enviar correo:', error);
      return false;
    }
  }
}
