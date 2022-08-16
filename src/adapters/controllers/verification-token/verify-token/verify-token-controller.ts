import { IUserVisibleData } from '@/adapters/controllers/user/interfaces';
import { getUserVisibleData } from '@/adapters/controllers/user/utils';
import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
  unauthorized,
} from '@/adapters/utils/http';
import { VerifyTokenUseCase } from '@/use-cases/verification-token/verify-token';
import { UserIsAlreadyVerifiedError } from '@/use-cases/verification-token/errors';

export class VerifyTokenController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly verifyToken: VerifyTokenUseCase,
  ) { }

  async handle({ params }: IHttpRequest): Promise<IHttpResponse<IUserVisibleData>> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { userId, token } = params;

      const accountOrError = await this.verifyToken.execute({ userId, token });
      if (accountOrError.isError()) {
        if (accountOrError.value instanceof UserIsAlreadyVerifiedError) {
          return unauthorized(new UserIsAlreadyVerifiedError());
        }
        return forbidden(accountOrError.value);
      }
      const account = getUserVisibleData(accountOrError.value);

      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
