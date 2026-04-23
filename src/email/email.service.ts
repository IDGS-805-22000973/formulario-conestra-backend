import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

    this.logger.debug(`Inicializando Email Service con usuario: ${emailUser}`);

    // Configurar el transporter de email
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Usa Gmail como servicio de SMTP
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Verificar la conexión al iniciar
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Error al verificar transporter:', error);
      } else {
        this.logger.log('Transporter de email listo para enviar mensajes');
      }
    });
  }

  async sendTestSubmissionEmail(
    candidateName: string,
    formType: 'MOSS' | '16PF',
  ): Promise<void> {
    // Fire and forget - no bloquear la respuesta
    this.sendEmailAsync(candidateName, formType).catch((error) => {
      this.logger.error('Error enviando email en background:', error);
    });
  }

  private async sendEmailAsync(
    candidateName: string,
    formType: 'MOSS' | '16PF',
  ): Promise<void> {
    try {
      const recipientEmail = 'cerveraburrolaj@gmail.com';
      const subject = `Nueva respuesta de formulario - ${formType}`;
      const htmlContent = `
        <h2>Nueva Respuesta de Formulario</h2>
        <p><strong>Candidato:</strong> ${candidateName}</p>
        <p><strong>Formulario respondido:</strong> ${formType}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</p>
      `;

      this.logger.debug(
        `Intentando enviar email a ${recipientEmail} para candidato: ${candidateName}`,
      );

      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
      });

      this.logger.log(
        `✅ Correo enviado exitosamente a ${recipientEmail}. MessageId: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Error al enviar correo: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
