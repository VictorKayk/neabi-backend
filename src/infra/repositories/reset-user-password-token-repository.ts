import { getUserRoles } from '@/infra/repositories/utils';
import { IResetUserPasswordTokenRepository } from '@/use-cases/user/reset-user-password/interfaces';
import { ITokenRepositoryReturnData } from '@/use-cases/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';
import { IAddResetUserPasswordToken } from '@/use-cases/user/reset-user-password/add-reset-user-password-token/interfaces';

export class ResetUserPasswordTokenRepository implements IResetUserPasswordTokenRepository {
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

  async findResetUserPasswordTokenByUserId(userId: string):
    Promise<ITokenRepositoryReturnData | null> {
    const tokenOrNull = await prisma.token.findFirst({
      where: { userId, isDeleted: false },
    });
    const resetUserPasswordTokenOrNull = await prisma.resetUserPasswordToken.findFirst({
      where: { Token: { userId, isDeleted: false } },
    });
    return resetUserPasswordTokenOrNull ? tokenOrNull : null;
  }

  async deleteResetUserPasswordTokenByUserId(userId: string): Promise<void> {
    await prisma.token.updateMany({
      where: { userId, isDeleted: false },
      data: { isDeleted: true },
    });
  }

  async add({
    resetUserPasswordTokenId, userId, token, expiresInHours,
  }: IAddResetUserPasswordToken): Promise<ITokenRepositoryReturnData> {
    const newToken = await prisma.token.create({
      data: {
        userId,
        token,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (expiresInHours * 3600000)),
        isDeleted: false,
      },
    });

    await prisma.resetUserPasswordToken.create({
      data: {
        id: resetUserPasswordTokenId,
        token,
      },
    });

    return newToken;
  }

  async updateUserResetUserPassword(userId: string, isVerified: boolean):
    Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified, updatedAt: new Date() },
      include: {
        UserHasRoles: {
          where: { isDeleted: false, Roles: { isDeleted: false } },
          select: { Roles: true },
        },
      },
    });
    const { UserHasRoles, ...userWithoutUserHasRoles } = user;
    return { ...userWithoutUserHasRoles, roles: getUserRoles(UserHasRoles) };
  }
}
