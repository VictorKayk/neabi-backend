import { DeleteUserUseCase } from '@/use-cases/user/delete-user';
import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController } from '@/adapters/controllers/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/util/http';

export class DeleteUserByIdController implements IController {
  constructor(
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) { }

  async handle({ params: { id } }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
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
