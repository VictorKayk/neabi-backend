import { Authentication } from '@/use-cases/authentication';
import { IAuthenticationResponse } from '@/use-cases/interfaces';
import { IMiddleware, IHttpResponse } from '@/adapters/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/util/http';

export class AuthenticationMiddleware implements IMiddleware<string> {
  constructor(
    private readonly authentication: Authentication,
  ) { }

  async handle(accessToken: string): Promise<IHttpResponse> {
    try {
      const authenticationOrError = await this.authentication.execute(accessToken);
      if (authenticationOrError.isError()) return unauthorized(authenticationOrError.value);

      const authenticationData: IAuthenticationResponse = authenticationOrError.value;
      return ok(authenticationData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
