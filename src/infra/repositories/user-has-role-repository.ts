import {
  IUserHasRoleData,
  IUserHasRoleEditableData,
  IUserHasRoleRepository,
  IUserHasRoleRepositoryReturnData,
} from '@/use-cases/user-has-role/interfaces';
import { IRoleDataQuery, IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';
import { getUserRoles } from '@/infra/repositories/utils';

export class UserHasRoleRepository implements IUserHasRoleRepository {
  async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
    const userOrNull = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      include: {
        UserHasRoles: {
          where: { Roles: { isDeleted: false } },
          select: { Roles: true },
        },
      },
    });
    return userOrNull ? { ...userOrNull, roles: getUserRoles(userOrNull.UserHasRoles) } : null;
  }

  async findRoleById(roleId: string): Promise<IRoleRepositoryReturnData | null> {
    const roleOrNull = await prisma.role.findFirst({
      where: { id: roleId, isDeleted: false },
    });
    return roleOrNull;
  }

  async findUserHasRole({ roleId, userId }: IUserHasRoleData):
    Promise<IUserHasRoleRepositoryReturnData | null> {
    const userHasRoleOrNull = await prisma.userHasRoles.findFirst({
      where: { roleId, userId },
    });
    return userHasRoleOrNull;
  }

  async addRoleToUser(userHasRoleData: IUserHasRoleData):
    Promise<IUserHasRoleRepositoryReturnData> {
    const userHasRole = await prisma.userHasRoles.create({
      data: {
        ...userHasRoleData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    });
    return userHasRole;
  }

  async removeRoleFromUser(userHasRole: IUserHasRoleData):
    Promise<IUserHasRoleRepositoryReturnData> {
    const userHasRoleData = await prisma.userHasRoles.update({
      where: { userId_roleId: userHasRole },
      data: { isDeleted: true, updatedAt: new Date() },
    });
    return userHasRoleData;
  }

  async updateRoleFromUser(
    userHasRole: IUserHasRoleData, userHasRoleEditableData: IUserHasRoleEditableData,
  ): Promise<IUserHasRoleRepositoryReturnData> {
    const userHasRoleData = await prisma.userHasRoles.update({
      where: { userId_roleId: userHasRole },
      data: { ...userHasRoleEditableData, updatedAt: new Date() },
    });
    return userHasRoleData;
  }

  async readAllRolesFromUser(userId: string, { id, role }: IRoleDataQuery):
    Promise<[] | IRoleRepositoryReturnData[]> {
    const rolesData = await prisma.userHasRoles.findMany({
      where: {
        userId,
        isDeleted: false,
        Roles: {
          id: { contains: id, mode: 'insensitive' },
          role: { contains: role, mode: 'insensitive' },
        },
      },
      select: { Roles: true },
      take: 100,
      orderBy: { isDeleted: 'asc' },
    });
    return getUserRoles(rolesData);
  }
}
