import { IUseCase, IEmailService } from '@/use-cases/interfaces';
import { Either, success, error } from '@/shared';
import { EmailServiceError } from '@/use-cases/errors';

type Response = Either<EmailServiceError, null>;
type Request = {
  user: { id: string, name: string, email: string },
  token: string,
  expiresInHours: number,
}

export class SendVerificationTokenUseCase implements IUseCase {
  constructor(
    private readonly baseUrl: string,
    private readonly emailService: IEmailService,
  ) { }

  async execute({ user: { id, name, email }, token, expiresInHours }: Request): Promise<Response> {
    try {
      const subject = 'Verificação de Email.';
      const text = `
      Por favor, clique no link para confirmar seu email: link \n
      Esse link irá expirar em ${expiresInHours} ${expiresInHours <= 1 ? 'hora' : 'horas'}.
    `;
      const html = `
      <p>Por favor, clique no link para confirmar seu email: <b><a href='${this.baseUrl}/user/${id}/verification/token/${token}'>link</a></b></p>
      <p><b>Esse link irá expirar em ${expiresInHours} ${expiresInHours <= 1 ? 'hora' : 'horas'}.</b></p>
    `;

      await this.emailService.send({
        to: `${name} <${email}>`, subject, text, html,
      });
      return success(null);
    } catch (e) {
      return error(new EmailServiceError());
    }
  }
}
