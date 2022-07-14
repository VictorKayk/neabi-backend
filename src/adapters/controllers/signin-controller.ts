import { SignIn } from '@/use-cases/signin';
import { IUserData } from '@/use-cases/interfaces';
import { InvalidEmailOrPasswordError } from '@/use-cases/errors';
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from '@/adapters/interfaces';
import {
  ok,
  serverError,
  badRequest,
  unauthorized,
} from '@/adapters/util/http';

export class SignInController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly signIn: SignIn,
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

      const account: IUserData = accountOrError.value;
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
