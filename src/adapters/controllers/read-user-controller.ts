import { ReadUserUseCase } from '@/use-cases/read-user';
import { IController, IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/util/http';
import { IUserVisibleData } from '@/use-cases/interfaces';

export class ReadUserController implements IController {
  constructor(
    private readonly readUserUseCase: ReadUserUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = body;

      const accountOrError = await this.readUserUseCase.execute(id);
      if (accountOrError.isError()) {
        return unauthorized(accountOrError.value);
      }

      const account: IUserVisibleData = accountOrError.value;
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
