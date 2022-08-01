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

    async add(roleData: IRoleData): Promise<IRoleRepositoryReturnData> {
      return {
        ...roleData,
        createdAt: new Date(),
      };
    }

    async readAllRoles(): Promise<IRoleRepositoryReturnData[] | []> {
      return [];
    }

    async deleteById(id: string): Promise<IRoleRepositoryReturnData> {
      return {
        id,
        role: 'any_role',
        createdAt: new Date(),
      };
    }
  }
  return new RoleRepositoryStub();
};
