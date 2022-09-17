import { AuthorizationUseCase } from '@/use-cases/authorization';
import { IHttpResponse } from '@/adapters/interfaces';
import { IMiddleware } from '@/adapters/middleware/interfaces';
import { ok, serverError, unauthorized } from '@/adapters/utils/http';

interface AuthorizationRequest {
  userId: string,
}

export class AuthorizationMiddleware implements IMiddleware<AuthorizationRequest> {
  constructor(
    private readonly authorization: AuthorizationUseCase,
    private readonly allowedRoles: Array<string>,
  ) { }

  async handle({ userId }: AuthorizationRequest): Promise<IHttpResponse> {
    try {
      const authorizationOrError = await this.authorization
        .execute({ userId, allowedRoles: this.allowedRoles });
      if (authorizationOrError.isError()) return unauthorized(authorizationOrError.value);

      const authorizationData = authorizationOrError.value;
      return ok(authorizationData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
