import { ExistingUserError, NonExistingUserError } from '@/use-cases/user/errors';
import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';
import { UpdateUserUseCase } from '@/use-cases/user/update-user';

export class UpdateUserByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly updateUser: UpdateUserUseCase,
  ) { }

  async handle({ params, body }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { id } = params;
      const { name, email, password } = body;

      const accountOrError = await this.updateUser.execute({
        id, userData: { name, email, password },
      });

      if (accountOrError.isError()) {
        if (accountOrError.value instanceof ExistingUserError
          || accountOrError.value instanceof NonExistingUserError) {
          return forbidden(accountOrError.value);
        }
        return badRequest(accountOrError.value);
      }

      const account = accountOrError.value;
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
