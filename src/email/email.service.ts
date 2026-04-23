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
      const subject = `✅ ${candidateName} completó el formulario ${formType}`;
      const formTypeLabel = formType === 'MOSS' ? '🧠 MOSS' : '📋 16PF';
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { background: white; padding: 40px 30px; }
            .info-box { background: #f5f7fa; border-left: 5px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .info-row { display: flex; justify-content: space-between; margin: 15px 0; font-size: 16px; }
            .label { font-weight: 600; color: #333; }
            .value { color: #667eea; font-weight: 500; }
            .badge { display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin: 10px 0; }
            .footer { background: #f5f7fa; color: #666; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #ddd; }
            .footer p { margin: 5px 0; }
            .divider { height: 1px; background: #ddd; margin: 20px 0; }
            .icon { font-size: 48px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">📝</div>
              <h1>Nuevo Formulario Completado</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Notificación de Conestra</p>
            </div>
            
            <div class="content">
              <div class="info-box">
                <div class="info-row">
                  <span class="label">👤 Candidato:</span>
                  <span class="value">${candidateName}</span>
                </div>
                <div class="divider"></div>
                <div class="info-row">
                  <span class="label">📋 Formulario:</span>
                  <span>${formTypeLabel}</span>
                </div>
                <div class="divider"></div>
                <div class="info-row">
                  <span class="label">⏰ Fecha y Hora:</span>
                  <span class="value">${formattedDate}</span>
                </div>
              </div>

              <div style="background: #e8f4f8; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <p style="margin: 0; color: #667eea; font-weight: 600;">✅ Formulario procesado exitosamente</p>
              </div>

              <p style="color: #666; margin-top: 30px; line-height: 1.6;">
                El candidato <strong>${candidateName}</strong> ha completado y enviado el formulario <strong>${formType}</strong>. 
                Puedes revisar los resultados en el panel de administración.
              </p>
            </div>

            <div class="footer">
              <p><strong>Plataforma Conestra</strong></p>
              <p>Sistema de Evaluación de Candidatos</p>
              <p style="margin-top: 15px; opacity: 0.7;">Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
        </html>
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
