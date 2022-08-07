import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { NonExistingRoleError } from '@/use-cases/role/errors';
import { UserDoesNotHaveThisRoleError } from '@/use-cases/user-has-role/errors';
import { IUserHasRoleData, IUserHasRoleRepositoryReturnData, IUserHasRoleRepository } from '@/use-cases/user-has-role/interfaces';
import { Either, error, success } from '@/shared';

type Response = Either<
  NonExistingUserError | NonExistingRoleError | UserDoesNotHaveThisRoleError,
  IUserHasRoleRepositoryReturnData
>;

export class RemoveRoleFromUserUseCase implements IUseCase {
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
    if (!userAlreadyHasThisRoleOrNull || userAlreadyHasThisRoleOrNull.isDeleted) {
      return error(new UserDoesNotHaveThisRoleError());
    }

    const roleData = await this.userHasRoleRepository.removeRoleFromUser({ userId, roleId });
    return success(roleData);
  }
}
