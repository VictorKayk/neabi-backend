import { AuthenticationUseCase } from '@/use-cases/authentication';
import { IHttpResponse } from '@/adapters/interfaces';
import { IMiddleware } from '@/adapters/middleware/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/utils/http';

interface AuthenticationRequest {
  accessToken: string
}

export class AuthenticationMiddleware implements IMiddleware<AuthenticationRequest> {
  constructor(
    private readonly authentication: AuthenticationUseCase,
  ) { }

  async handle({ accessToken }: AuthenticationRequest): Promise<IHttpResponse> {
    try {
      const authenticationOrError = await this.authentication.execute(accessToken);
      if (authenticationOrError.isError()) return unauthorized(authenticationOrError.value);

      const authenticationData = authenticationOrError.value;
      return ok(authenticationData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
