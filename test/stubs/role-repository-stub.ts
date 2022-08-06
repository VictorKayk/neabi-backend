import {
  IRoleRepository,
  IRoleData,
  IRoleRepositoryReturnData,
  IRoleEditableData,
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
        updatedAt: new Date(),
        isDeleted: false,
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
        updatedAt: new Date(),
        isDeleted: false,
      };
    }

    async updateById(id: string, roleData: IRoleEditableData): Promise<IRoleRepositoryReturnData> {
      return {
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...roleData,
        isDeleted: roleData.isDeleted || false,
        role: roleData.role || 'any_role',
      };
    }
  }
  return new RoleRepositoryStub();
};
