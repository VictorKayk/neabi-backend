import { getUserRoles } from '@/infra/repositories/utils';
import { IVerificationTokenRepository } from '@/use-cases/user/verification-token/interfaces';
import { IUserRepositoryReturnData, ITokenRepositoryReturnData } from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';
import { IAddVerificationToken } from '@/use-cases/user/verification-token/add-verification-token/interfaces';

export class VerificationTokenRepository implements IVerificationTokenRepository {
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

  async findVerificationTokenByUserId(userId: string):
    Promise<ITokenRepositoryReturnData | null> {
    const tokenOrNull = await prisma.token.findFirst({
      where: { userId, isDeleted: false },
    });
    const verificationTokenOrNull = await prisma.verificationToken.findFirst({
      where: { Token: { userId, isDeleted: false } },
    });
    return verificationTokenOrNull ? tokenOrNull : null;
  }

  async deleteVerificationTokenByUserId(userId: string): Promise<void> {
    await prisma.token.updateMany({
      where: { userId, isDeleted: false },
      data: { isDeleted: true },
    });
  }

  async add({
    verificationTokenId, userId, token, expiresInHours,
  }: IAddVerificationToken): Promise<ITokenRepositoryReturnData> {
    const newToken = await prisma.token.create({
      data: {
        userId,
        token,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (expiresInHours * 3600000)),
        isDeleted: false,
      },
    });

    await prisma.verificationToken.create({
      data: {
        id: verificationTokenId,
        token,
      },
    });

    return newToken;
  }

  async updateUserVerification(userId: string, isVerified: boolean):
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
