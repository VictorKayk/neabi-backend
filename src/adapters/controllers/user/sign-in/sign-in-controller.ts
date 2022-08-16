import { InvalidEmailOrPasswordError } from '@/use-cases/user/errors';
import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  unauthorized,
} from '@/adapters/utils/http';
import { SignInUseCase } from '@/use-cases/user/sign-in';
import { getUserVisibleData } from '@/adapters/controllers/user/utils';
import { IUserVisibleData } from '@/adapters/controllers/user/interfaces';

export class SignInController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly signIn: SignInUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse<IUserVisibleData>> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { email, password } = body;

      const accountOrError = await this.signIn.execute({ email, password });
      if (accountOrError.isError()) {
        if (accountOrError.value instanceof InvalidEmailOrPasswordError) {
          return unauthorized(accountOrError.value);
        }
        return badRequest(accountOrError.value);
      }

      const account = getUserVisibleData(accountOrError.value);
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
