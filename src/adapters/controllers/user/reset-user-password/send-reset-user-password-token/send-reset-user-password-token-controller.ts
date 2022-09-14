import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';
import { AddResetUserPasswordTokenUseCase } from '@/use-cases/user/reset-user-password/add-reset-user-password-token';
import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { SendEmailService } from '@/use-cases/services/email-service/send-email';

export class SendResetUserPasswordTokenToUserController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addResetUserPasswordToken: AddResetUserPasswordTokenUseCase,
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

      const expiresInHours = 1;
      const resetUserPasswordTokenOrError = await this.addResetUserPasswordToken.execute(
        id, expiresInHours,
      );
      if (resetUserPasswordTokenOrError.isError()) {
        return forbidden(resetUserPasswordTokenOrError.value);
      }

      const subject = 'Esqueceu sua senha?.';
      const html = `
        <p>Por favor, clique no link para alterar sua senha: <b><a href='${this.url}/user/${id}/reset-user-password/token/${resetUserPasswordTokenOrError.value.token}'>link</a></b></p>
        <p><b>Esse link irá expirar em ${expiresInHours} ${expiresInHours <= 1 ? 'hora' : 'horas'}.</b></p>
      `;

      const sendResetUserPasswordTokenOrError = await this.sendEmailService.execute({
        user: { name: accountOrError.value.name, email: accountOrError.value.email },
        subject,
        text: '',
        html,
      });
      if (sendResetUserPasswordTokenOrError.isError()) {
        return badRequest(sendResetUserPasswordTokenOrError.value);
      }

      return ok();
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
