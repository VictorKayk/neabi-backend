import { IUserHasRoleRepository } from '@/use-cases/user-has-role/interfaces';
import { IUseCase } from '@/use-cases/interfaces';
import { UnauthorizedError } from '@/use-cases/errors';
import { Either, error, success } from '@/shared';

interface AuthorizationRequest {
    userId: string,
    allowedRoles: Array<string>,
}

type Response = Either<UnauthorizedError, null>;

export class AuthorizationUseCase implements IUseCase {
  constructor(
    private readonly userHasRoleRepository: IUserHasRoleRepository,
  ) { }

  async execute({ userId, allowedRoles }: AuthorizationRequest): Promise<Response> {
    const userRolesOrNull = await this.userHasRoleRepository.readAllRolesFromUser(userId, {});
    if (userRolesOrNull.length < 1) return error(new UnauthorizedError());

    const userHasSomeAllowedRole = userRolesOrNull
      .some((userRole) => allowedRoles.includes(userRole.role));
    if (!userHasSomeAllowedRole) return error(new UnauthorizedError());

    return success(null);
  }
}
