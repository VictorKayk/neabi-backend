import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';
import { AddVerificationTokenUseCase } from '@/use-cases/verification-token/add-verification-token';
import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { SendVerificationTokenUseCase } from '@/use-cases/verification-token/send-verification-token';

export class SendVerificationTokenToUserController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addVerificationToken: AddVerificationTokenUseCase,
    private readonly readUserUseCase: ReadUserUseCase,
    private readonly sendVerificationToken: SendVerificationTokenUseCase,
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
      const verificationTokenOrError = await this.addVerificationToken.execute(
        id, expiresInHours,
      );
      if (verificationTokenOrError.isError()) {
        return forbidden(verificationTokenOrError.value);
      }

      const sendVerificationTokenOrError = await this.sendVerificationToken.execute({
        user: { id, name: accountOrError.value.name, email: accountOrError.value.email },
        token: verificationTokenOrError.value.token,
        expiresInHours,
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
