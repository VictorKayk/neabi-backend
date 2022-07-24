import { ReadUserUseCase } from '@/use-cases/read-user';
import { IController, IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/util/http';

export class ReadUserByIdController implements IController {
  constructor(
    private readonly readUserUseCase: ReadUserUseCase,
  ) { }

  async handle({ params: { id } }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
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
