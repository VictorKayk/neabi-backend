import { InvalidEmailOrPasswordError } from '@/use-cases/user/errors';
import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  unauthorized,
} from '@/adapters/util/http';
import { SignInUseCase } from '@/use-cases/user/sign-in';

export class SignInController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly signIn: SignInUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse> {
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

      const account = accountOrError.value;
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
