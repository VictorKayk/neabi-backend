import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { UserAlreadyHaveThisRoleError } from '@/use-cases/user-has-role/errors';
import { IUserHasRoleData, IUserHasRoleRepositoryReturnData, IUserHasRoleRepository } from '@/use-cases/user-has-role/interfaces';
import { Either, error, success } from '@/shared';

type Response = Either<
  NonExistingUserError | NonExistingRoleError | UserAlreadyHaveThisRoleError,
  IUserHasRoleRepositoryReturnData
>;

export class AddRoleToUserUseCase implements IUseCase {
  constructor(
    private readonly userHasRoleRepository: IUserHasRoleRepository,
  ) { }

  async execute({ userId, roleId }: IUserHasRoleData): Promise<Response> {
    const userOrNull = await this.userHasRoleRepository.findUserById(userId);
    if (!userOrNull) return error(new NonExistingUserError());

    const roleOrNull = await this.userHasRoleRepository.findRoleById(roleId);
    if (!roleOrNull) return error(new NonExistingRoleError());

    const userAlreadyHasThisRoleOrNull = await this.userHasRoleRepository
      .findUserHasRole({ userId, roleId });
    if (userAlreadyHasThisRoleOrNull) return error(new UserAlreadyHaveThisRoleError());

    const roleData = await this.userHasRoleRepository.addRoleToUser({ userId, roleId });
    return success(roleData);
  }
}
