import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController } from '@/adapters/controllers/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/utils/http';
import { getUserVisibleData } from '@/adapters/controllers/user/utils';
import { IUserVisibleData } from '@/adapters/controllers/user/interfaces';

export class ReadUserController implements IController {
  constructor(
    private readonly readUserUseCase: ReadUserUseCase,
  ) { }

  async handle({ user: { id } }: IHttpRequestAuthenticated):
    Promise<IHttpResponse<IUserVisibleData>> {
    try {
      const accountOrError = await this.readUserUseCase.execute(id);
      if (accountOrError.isError()) {
        return unauthorized(accountOrError.value);
      }

      const account = getUserVisibleData(accountOrError.value);
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
