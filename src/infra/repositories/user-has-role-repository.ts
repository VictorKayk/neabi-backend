import { IUserHasRoleData, IUserHasRoleRepository, IUserHasRoleRepositoryReturnData } from '@/use-cases/user-has-role/interfaces';
import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';

export class UserHasRoleRepository implements IUserHasRoleRepository {
  async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    return user;
  }

  async findRoleById(roleId: string): Promise<IRoleRepositoryReturnData | null> {
    const role = await prisma.roles.findFirst({
      where: { id: roleId },
    });
    return role;
  }

  async addRoleToUser(userHasRole: IUserHasRoleData): Promise<IUserHasRoleRepositoryReturnData> {
    const role = await prisma.userHasRoles.create({
      data: userHasRole,
    });
    return role;
  }
}
