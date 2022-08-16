import { AuthenticationUseCase } from '@/use-cases/authentication';
import { IAuthenticationResponse } from '@/use-cases/authentication/interfaces';
import { IHttpResponse } from '@/adapters/interfaces';
import { IMiddleware } from '@/adapters/middleware/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/utils/http';

interface IAuthenticationRequest {
  accessToken: string
}

export class AuthenticationMiddleware implements IMiddleware<IAuthenticationRequest> {
  constructor(
    private readonly authentication: AuthenticationUseCase,
  ) { }

  async handle({ accessToken }: IAuthenticationRequest): Promise<IHttpResponse> {
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
