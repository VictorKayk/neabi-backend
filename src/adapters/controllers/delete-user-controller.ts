import { DeleteUserUseCase } from '@/use-cases/delete-user';
import { IController, IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/util/http';

export class DeleteUserController implements IController {
  constructor(
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) { }

  async handle({ id }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const accountOrError = await this.deleteUserUseCase.execute(id);
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
