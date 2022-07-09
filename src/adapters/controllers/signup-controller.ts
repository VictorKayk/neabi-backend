import { SignUp } from '@/use-cases/signup';
import { IUserData } from '@/use-cases/interfaces';
import { ExistingUserError } from '@/use-cases/errors';
import { IController, IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';

export class SignUpController implements IController {
  constructor(private readonly signUp: SignUp) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse> {
    try {
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
