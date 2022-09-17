import {
  IRoleRepositoryReturnData, IRoleData, IRoleRepository, IRoleDataQuery, IRoleEditableData,
} from '@/use-cases/role/interfaces';
import prisma from '@/main/config/prisma';

export class RoleRepository implements IRoleRepository {
  async add(roleData: IRoleData): Promise<IRoleRepositoryReturnData> {
    const roleReturnData = await prisma.role.create({
      data: {
        ...roleData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
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
      where: { id },
    });
    return roleReturnData;
  }

  async readAllRoles({ id, role }: IRoleDataQuery):
    Promise<IRoleRepositoryReturnData[] | []> {
    const roles = await prisma.role.findMany({
      where: {
        id: { contains: id, mode: 'insensitive' },
        role: { contains: role, mode: 'insensitive' },
      },
      take: 100,
      orderBy: { isDeleted: 'asc' },
    });
    return roles;
  }

  async deleteById(id: string): Promise<IRoleRepositoryReturnData> {
    const roles = await prisma.role.update({
      where: { id },
      data: { isDeleted: true, updatedAt: new Date() },
    });
    return roles;
  }

  async updateById(id: string, { role, isDeleted }: IRoleEditableData):
    Promise<IRoleRepositoryReturnData> {
    const roleUpdated = await prisma.role.update({
      where: { id },
      data: { role, isDeleted, updatedAt: new Date() },
    });
    return roleUpdated;
  }
}
