import { ReadUserUseCase } from '@/use-cases/user/read-user';
import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  badRequest, ok, serverError, unauthorized,
} from '@/adapters/utils/http';
import { getUserCriticalData } from '@/adapters/controllers/user/utils';
import { IUserCriticalData } from '@/adapters/controllers/user/interfaces';

export class ReadUserByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readUserUseCase: ReadUserUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse<IUserCriticalData>> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { id } = params;

      const accountOrError = await this.readUserUseCase.execute(id);
      if (accountOrError.isError()) {
        return unauthorized(accountOrError.value);
      }

      const account = getUserCriticalData(accountOrError.value);
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
