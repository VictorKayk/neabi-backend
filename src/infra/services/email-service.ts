import * as nodemailer from 'nodemailer';
import { IEmailOptions, IEmailService } from '@/use-cases/services/email-service/interfaces';

type IAuth = { user: string, clientId: string, clientSecret: string, refreshToken: string };

export class EmailService implements IEmailService {
  transporter: nodemailer.Transporter

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly from: string,
    private readonly auth: IAuth,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: {
        type: 'OAuth2',
        user: this.auth.user,
        clientId: this.auth.clientId,
        clientSecret: this.auth.clientSecret,
        refreshToken: this.auth.refreshToken,
      },
      secure: true,
    });
  }

  async send({
    to, subject, text, html, attachments,
  }: IEmailOptions): Promise<null> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      text,
      html,
      attachments: attachments || [],
    });
    return null;
  }
}
