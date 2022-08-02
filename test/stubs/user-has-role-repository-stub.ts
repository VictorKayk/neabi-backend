import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import { IUserHasRoleData, IUserHasRoleRepositoryReturnData, IUserHasRoleRepository } from '@/use-cases/user-has-role/interfaces';

export const makeUserHasRoleRepository = (): IUserHasRoleRepository => {
  class UserHasRoleRepositoryStub implements IUserHasRoleRepository {
    async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async findRoleById(roleId: string): Promise<IRoleRepositoryReturnData | null> {
      return null;
    }

    async addRoleToUser(userHasRole: IUserHasRoleData): Promise<IUserHasRoleRepositoryReturnData> {
      return {
        ...userHasRole,
        createdAt: new Date(),
      };
    }
  }
  return new UserHasRoleRepositoryStub();
};
