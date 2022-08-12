import * as nodemailer from 'nodemailer';
import { IEmailOptions, IEmailService } from '@/use-cases/email-service/interfaces';

type IAuth = { user: string, pass: string };

export class EmailService implements IEmailService {
  transporter: nodemailer.Transporter

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly auth: IAuth,
    private readonly from: string,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: this.auth,
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
