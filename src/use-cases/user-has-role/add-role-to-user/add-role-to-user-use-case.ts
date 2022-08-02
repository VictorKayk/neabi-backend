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

  async execute({ idUser, idRole }: IUserHasRoleData): Promise<Response> {
    const userOrNull = await this.userHasRoleRepository.findUserById(idUser);
    if (!userOrNull) return error(new NonExistingUserError());

    const roleOrNull = await this.userHasRoleRepository.findRoleById(idRole);
    if (!roleOrNull) return error(new NonExistingRoleError());

    if (userOrNull.roles?.findIndex((role) => role.id === roleOrNull.id)) {
      return error(new UserAlreadyHaveThisRoleError());
    }

    const roleData = await this.userHasRoleRepository.addRoleToUser({ idUser, idRole });
    return success(roleData);
  }
}
