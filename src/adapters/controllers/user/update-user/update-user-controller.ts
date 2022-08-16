import { ExistingUserError, NonExistingUserError } from '@/use-cases/user/errors';
import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';
import { UpdateUserUseCase } from '@/use-cases/user/update-user';
import { getUserVisibleData } from '@/adapters/controllers/user/utils';
import { IUserVisibleData } from '@/adapters/controllers/user/interfaces';

export class UpdateUserController implements IController {
  constructor(private readonly updateUser: UpdateUserUseCase) { }

  async handle({ user: { id }, body }: IHttpRequestAuthenticated):
    Promise<IHttpResponse<IUserVisibleData>> {
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

      const account = getUserVisibleData(accountOrError.value);
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
