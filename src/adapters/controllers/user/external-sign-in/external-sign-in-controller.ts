/* eslint-disable camelcase */
import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import { ok, serverError, badRequest } from '@/adapters/util/http';
import { getUserVisibleData } from '@/adapters/controllers/user/utils';
import { IUserVisibleData } from '@/adapters/controllers/user/interfaces';

export class ExternalSignInController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly externalSignIn: ExternalSignInUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse<IUserVisibleData>> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { name, email, email_verified } = body;
      const accountOrError = await this.externalSignIn.execute(
        { name, email, isVerified: email_verified },
      );
      if (accountOrError.isError()) return badRequest(accountOrError.value);
      const account = getUserVisibleData(accountOrError.value);

      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
