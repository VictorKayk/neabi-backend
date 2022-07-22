import { UpdateUserUseCase } from '@/use-cases/update-user';
import { ExistingUserError, NonExistingUserError } from '@/use-cases/errors';
import { IController, IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';

export class UpdateUserController implements IController {
  constructor(private readonly updateUser: UpdateUserUseCase) { }

  async handle({ id, body }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const { name, email, password } = body;
      const accountOrError = await this.updateUser.execute({
        id,
        userData: {
          name, email, password,
        },
      });

      if (accountOrError.isError()) {
        if (accountOrError.value instanceof ExistingUserError
          || accountOrError.value instanceof NonExistingUserError) {
          return forbidden(accountOrError.value);
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
