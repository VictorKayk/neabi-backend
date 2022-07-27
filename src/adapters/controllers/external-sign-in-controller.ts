import { ExternalSignInUseCase } from '@/use-cases/external-sign-in';
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from '@/adapters/interfaces';
import { ok, serverError, badRequest } from '@/adapters/util/http';

export class ExternalSignInController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly externalSignIn: ExternalSignInUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { name, email } = body;
      const accountOrError = await this.externalSignIn.execute({ name, email });
      if (accountOrError.isError()) return badRequest(accountOrError.value);

      const account = accountOrError.value;
      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
