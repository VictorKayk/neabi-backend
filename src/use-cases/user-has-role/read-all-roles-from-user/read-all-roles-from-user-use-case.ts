import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IUserHasRoleRepository } from '@/use-cases/user-has-role/interfaces';
import { Either, error, success } from '@/shared';
import { IRoleDataQuery, IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';

type Response = Either<NonExistingUserError, IRoleRepositoryReturnData[] | []>;

interface Request {
  userId: string,
  roleDataQuery: IRoleDataQuery
}

export class ReadAllRolesFromUserUseCase implements IUseCase {
  constructor(
    private readonly userHasRoleRepository: IUserHasRoleRepository,
  ) { }

  async execute({ userId, roleDataQuery }: Request): Promise<Response> {
    const userOrNull = await this.userHasRoleRepository.findUserById(userId);
    if (!userOrNull) return error(new NonExistingUserError());

    const userRoles = await this.userHasRoleRepository.readAllRolesFromUser(userId, roleDataQuery);
    return success(userRoles);
  }
}
