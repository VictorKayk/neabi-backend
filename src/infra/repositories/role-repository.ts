import { IRoleRepositoryReturnData, IRoleData, IRoleRepository } from '@/use-cases/role/interfaces';
import prisma from '@/main/config/prisma';

export class RoleRepository implements IRoleRepository {
  async add(roleData: IRoleData): Promise<IRoleRepositoryReturnData> {
    const roleReturnData = await prisma.role.create({
      data: roleData,
    });
    return roleReturnData;
  }

  async findByRole(role: string): Promise<IRoleRepositoryReturnData | null> {
    const roleReturnData = await prisma.role.findFirst({
      where: { role },
    });
    return roleReturnData;
  }

  async findById(id: string): Promise<IRoleRepositoryReturnData | null> {
    const roleReturnData = await prisma.role.findFirst({
      where: {
        id,
      },
    });
    return roleReturnData;
  }

  async readAllRoles(): Promise<IRoleRepositoryReturnData[] | []> {
    const roles = await prisma.role.findMany();
    return roles;
  }

  async deleteById(id: string): Promise<IRoleRepositoryReturnData> {
    const roles = await prisma.role.delete({
      where: { id },
    });
    return roles;
  }

  async updateById({ id, role }: IRoleData): Promise<IRoleRepositoryReturnData> {
    const roleUpdated = await prisma.role.update({
      where: { id },
      data: { role },
    });
    return roleUpdated;
  }
}
