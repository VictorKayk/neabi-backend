import { IUserHasRoleData, IUserHasRoleRepository, IUserHasRoleRepositoryReturnData } from '@/use-cases/user-has-role/interfaces';
import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';

export class UserHasRoleRepository implements IUserHasRoleRepository {
  async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
    const userOrNull = await prisma.user.findFirst({
      where: { id: userId },
    });
    return userOrNull;
  }

  async findRoleById(roleId: string): Promise<IRoleRepositoryReturnData | null> {
    const roleOrNull = await prisma.roles.findFirst({
      where: { id: roleId },
    });
    return roleOrNull;
  }

  async findUserHasRole(userHasRole: IUserHasRoleData):
    Promise<IUserHasRoleRepositoryReturnData | null> {
    const userHasRoleOrNull = await prisma.userHasRoles.findFirst({
      where: userHasRole,
    });
    return userHasRoleOrNull;
  }

  async addRoleToUser(userHasRole: IUserHasRoleData): Promise<IUserHasRoleRepositoryReturnData> {
    const role = await prisma.userHasRoles.create({
      data: userHasRole,
    });
    return role;
  }
}
