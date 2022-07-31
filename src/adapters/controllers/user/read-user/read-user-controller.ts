import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController } from '@/adapters/controllers/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/util/http';

export class ReadUserController implements IController {
  constructor(
    private readonly readUserUseCase: ReadUserUseCase,
  ) { }

  async handle({ id }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const accountOrError = await this.readUserUseCase.execute(id);
      if (accountOrError.isError()) {
        return unauthorized(accountOrError.value);
      }

      const account = accountOrError.value;
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
