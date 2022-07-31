import { IRoleRepositoryReturnData, IRoleData, IRoleRepository } from '@/use-cases/role/interfaces';
import prisma from '@/main/config/prisma';

export class RoleRepository implements IRoleRepository {
  async add(roleData: IRoleData): Promise<IRoleRepositoryReturnData> {
    const roleReturnData = await prisma.roles.create({
      data: roleData,
    });
    return roleReturnData;
  }

  async findByRole(role: string): Promise<IRoleRepositoryReturnData | null> {
    const roleReturnData = await prisma.roles.findFirst({
      where: { role },
    });
    return roleReturnData;
  }

  async findById(id: string): Promise<IRoleRepositoryReturnData | null> {
    const roleReturnData = await prisma.roles.findFirst({
      where: {
        id,
      },
    });
    return roleReturnData;
  }

  async readAllRoles(): Promise<IRoleRepositoryReturnData[] | []> {
    const roles = await prisma.roles.findMany();
    return roles;
  }
}
