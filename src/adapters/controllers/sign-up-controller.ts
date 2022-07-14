import { SignUp } from '@/use-cases/sign-up';
import { IUserData } from '@/use-cases/interfaces';
import { ExistingUserError } from '@/use-cases/errors';
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from '@/adapters/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';

export class SignUpController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly signUp: SignUp,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse> {
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

      const account: IUserData = accountOrError.value;
      return created(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
