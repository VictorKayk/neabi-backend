import { ReadAllUsersUseCase } from '@/use-cases/user/read-all-users';
import { IHttpResponse } from '@/adapters/interfaces';
import { IController } from '@/adapters/controllers/interfaces';
import { ok, serverError } from '@/adapters/util/http';

export class ReadAllUsersController implements IController {
  constructor(
    private readonly readAllUsersUseCase: ReadAllUsersUseCase,
  ) { }

  async handle(): Promise<IHttpResponse> {
    try {
      const accounts = await this.readAllUsersUseCase.execute();
      return ok(accounts);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
