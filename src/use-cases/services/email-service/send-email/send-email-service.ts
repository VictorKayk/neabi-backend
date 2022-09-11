import { IUseCase } from '@/use-cases/interfaces';
import { IEmailService } from '@/use-cases/services/email-service/interfaces';
import { EmailServiceError } from '@/use-cases/services/email-service/errors';
import { Either, success, error } from '@/shared';

type Response = Either<EmailServiceError, null>;
type Request = {
  user: { name: string, email: string },
  subject: string,
  text: string,
  html: string,
}

export class SendEmailService implements IUseCase {
  constructor(
    private readonly emailService: IEmailService,
  ) { }

  async execute({
    user: { name, email }, subject, text, html,
  }: Request): Promise<Response> {
    try {
      await this.emailService.send({
        to: `${name} <${email}>`, subject, text, html,
      });
      return success(null);
    } catch (e) {
      return error(new EmailServiceError());
    }
  }
}
