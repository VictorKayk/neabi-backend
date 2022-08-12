import { ExistingUserError } from '@/use-cases/user/errors';
import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';
import { SignUpUseCase } from '@/use-cases/user/sign-up';
import { getUserVisibleData } from '@/adapters/controllers/user/utils';
import { IUserVisibleData } from '@/adapters/controllers/user/interfaces';
import { AddEmailVerificationTokenUseCase } from '@/use-cases/email-verification-token/add-email-verification-token';

export class SignUpController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly signUp: SignUpUseCase,
    private readonly addEmailVerificationToken: AddEmailVerificationTokenUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse<IUserVisibleData>> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { name, email, password } = body;

      const accountOrError = await this.signUp.execute({ name, email, password });
      if (accountOrError.isError()) {
        if (accountOrError.value instanceof ExistingUserError) {
          return forbidden(accountOrError.value);
        }
        return badRequest(accountOrError.value);
      }

      const expiresInHours = 1;
      const emailVerificationTokenOrError = await this.addEmailVerificationToken
        .execute(accountOrError.value.id, expiresInHours);
      if (emailVerificationTokenOrError.isError()) {
        return forbidden(emailVerificationTokenOrError.value);
      }

      const account = getUserVisibleData(accountOrError.value);
      return created(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
