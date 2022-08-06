import { IUserHasRoleData, IUserHasRoleRepository, IUserHasRoleRepositoryReturnData } from '@/use-cases/user-has-role/interfaces';
import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';
import { getUserRoles } from '@/infra/repositories/utils';

export class UserHasRoleRepository implements IUserHasRoleRepository {
  async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
    const userOrNull = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      include: { userHasRoles: { select: { roles: true } } },
    });
    return userOrNull ? { ...userOrNull, roles: getUserRoles(userOrNull.userHasRoles) } : null;
  }

  async findRoleById(roleId: string): Promise<IRoleRepositoryReturnData | null> {
    const roleOrNull = await prisma.role.findFirst({
      where: { id: roleId, isDeleted: false },
    });
    return roleOrNull;
  }

  async findUserHasRole(userHasRoleData: IUserHasRoleData):
    Promise<IUserHasRoleRepositoryReturnData | null> {
    const userHasRoleOrNull = await prisma.userHasRoles.findFirst({
      where: { ...userHasRoleData, isDeleted: false },
    });
    return userHasRoleOrNull;
  }

  async addRoleToUser(userHasRoleData: IUserHasRoleData):
    Promise<IUserHasRoleRepositoryReturnData> {
    const role = await prisma.userHasRoles.create({
      data: {
        ...userHasRoleData,
        createdAt: new Date(),
        isDeleted: false,
      },
    });
    return role;
  }
}
