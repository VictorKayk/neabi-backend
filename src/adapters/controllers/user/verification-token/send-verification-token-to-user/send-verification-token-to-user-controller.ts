import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
  unauthorized,
} from '@/adapters/utils/http';
import { AddVerificationTokenUseCase } from '@/use-cases/user/verification-token/add-verification-token';
import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { SendEmailService } from '@/use-cases/services/email-service/send-email';
import { UserIsAlreadyVerifiedError } from '@/use-cases/user/verification-token/errors';

export class SendVerificationTokenToUserController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addVerificationToken: AddVerificationTokenUseCase,
    private readonly readUserUseCase: ReadUserUseCase,
    private readonly sendEmailService: SendEmailService,
    private readonly url: string,
  ) { }

  async handle({ user }: IHttpRequestAuthenticated): Promise<IHttpResponse<null>> {
    try {
      const validationError = this.validation.validate(user);
      if (validationError) return badRequest(validationError);

      const { id } = user;

      const accountOrError = await this.readUserUseCase.execute(id);
      if (accountOrError.isError()) {
        return forbidden(accountOrError.value);
      }

      if (accountOrError.value.isVerified) return unauthorized(new UserIsAlreadyVerifiedError());

      const expiresInHours = 1;
      const verificationTokenOrError = await this.addVerificationToken.execute(
        id, expiresInHours,
      );
      if (verificationTokenOrError.isError()) {
        return forbidden(verificationTokenOrError.value);
      }

      const subject = 'Verificação de Email.';
      const html = `
        <p>Por favor, clique no link para confirmar seu email: <b><a href='${this.url}/user/${id}/verification/token/${verificationTokenOrError.value.token}'>link</a></b></p>
        <p><b>Esse link irá expirar em ${expiresInHours} ${expiresInHours <= 1 ? 'hora' : 'horas'}.</b></p>
      `;

      const sendVerificationTokenOrError = await this.sendEmailService.execute({
        user: { name: accountOrError.value.name, email: accountOrError.value.email },
        subject,
        text: '',
        html,
      });
      if (sendVerificationTokenOrError.isError()) {
        return badRequest(sendVerificationTokenOrError.value);
      }

      return ok();
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
