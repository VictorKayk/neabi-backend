import {
  IRoleRepository,
  IRoleData,
  IRoleRepositoryReturnData,
} from '@/use-cases/role/interfaces';

export const makeRoleRepository = (): IRoleRepository => {
  class RoleRepositoryStub implements IRoleRepository {
    async findByRole(role: string): Promise<IRoleRepositoryReturnData | null> {
      return null;
    }

    async findById(id: string): Promise<IRoleRepositoryReturnData | null> {
      return null;
    }

    async add(userData: IRoleData): Promise<IRoleRepositoryReturnData> {
      return {
        ...userData,
        createdAt: new Date(),
      };
    }
  }
  return new RoleRepositoryStub();
};
