import { IUserVisibleData } from '@/adapters/controllers/user/interfaces';
import { getUserVisibleData } from '@/adapters/controllers/user/utils';
import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';
import { VerifyTokenUseCase } from '@/use-cases/user/reset-user-password/verify-reset-user-password-token';
import { UpdateUserUseCase } from '@/use-cases/user/update-user';
import { ExistingUserError, NonExistingUserError } from '@/use-cases/user/errors';

export class VerifyTokenController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly verifyToken: VerifyTokenUseCase,
    private readonly updateUser: UpdateUserUseCase,
  ) { }

  async handle({ params, body }: IHttpRequest): Promise<IHttpResponse<IUserVisibleData>> {
    try {
      const validationError = this.validation.validate({ ...params, ...body });
      if (validationError) return badRequest(validationError);

      const { userId, token } = params;
      const { password } = body;

      const accountOrError = await this.verifyToken.execute({ userId, token });
      if (accountOrError.isError()) return forbidden(accountOrError.value);

      const userUpdated = await this.updateUser.execute({
        id: accountOrError.value.id,
        userData: { password },
      });
      if (userUpdated.isError()) {
        if (userUpdated.value instanceof ExistingUserError
          || userUpdated.value instanceof NonExistingUserError) {
          return forbidden(userUpdated.value);
        }
        return badRequest(userUpdated.value);
      }

      const account = getUserVisibleData(userUpdated.value);

      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
