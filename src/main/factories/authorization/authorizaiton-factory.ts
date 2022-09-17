import { AuthorizationMiddleware } from '@/adapters/middleware/authorization';
import { AuthorizationUseCase } from '@/use-cases/authorization';
import { IMiddleware } from '@/adapters/middleware/interfaces';
import { UserHasRoleRepository } from '@/infra/repositories';

export function makeAuthorizationMiddleware(allowedRoles: Array<string>): IMiddleware {
  const userhasRoleRepository = new UserHasRoleRepository();
  const authorizationUseCase = new AuthorizationUseCase(userhasRoleRepository);
  const authorizationMiddleware = new AuthorizationMiddleware(authorizationUseCase, allowedRoles);
  return authorizationMiddleware;
}
