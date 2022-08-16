import { ReadAllUsersUseCase } from '@/use-cases/user/read-all-users';
import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController } from '@/adapters/controllers/interfaces';
import { ok, serverError } from '@/adapters/utils/http';
import { getUserCriticalData } from '@/adapters/controllers/user/utils';
import { IUserCriticalData } from '@/adapters/controllers/user/interfaces';

export class ReadAllUsersController implements IController {
  constructor(
    private readonly readAllUsersUseCase: ReadAllUsersUseCase,
  ) { }

  async handle({ query }: IHttpRequest): Promise<IHttpResponse<IUserCriticalData>> {
    try {
      const accounts = await this.readAllUsersUseCase.execute(query);

      const accountsWithCriticalData = accounts.map((account) => getUserCriticalData(account));
      return ok(accountsWithCriticalData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
