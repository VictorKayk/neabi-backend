import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import {
  IUserHasRoleData,
  IUserHasRoleRepositoryReturnData,
  IUserHasRoleRepository,
  IUserHasRoleEditableData,
} from '@/use-cases/user-has-role/interfaces';

export const makeUserHasRoleRepository = (): IUserHasRoleRepository => {
  class UserHasRoleRepositoryStub implements IUserHasRoleRepository {
    async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async findRoleById(roleId: string): Promise<IRoleRepositoryReturnData | null> {
      return null;
    }

    async findUserHasRole(userHasRole: IUserHasRoleData):
      Promise<IUserHasRoleRepositoryReturnData | null> {
      return null;
    }

    async addRoleToUser(userHasRole: IUserHasRoleData): Promise<IUserHasRoleRepositoryReturnData> {
      return {
        ...userHasRole,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };
    }

    async removeRoleFromUser(userHasRole: IUserHasRoleData):
      Promise<IUserHasRoleRepositoryReturnData> {
      return {
        ...userHasRole,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };
    }

    async updateRoleFromUser(
      userHasRole: IUserHasRoleData, userHasRoleEditableData: IUserHasRoleEditableData,
    ): Promise<IUserHasRoleRepositoryReturnData> {
      return {
        ...userHasRole,
        isDeleted: false,
        ...userHasRoleEditableData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }
  return new UserHasRoleRepositoryStub();
};
