import { getUserRoles } from '@/infra/repositories/utils';
import { IVerificationTokenRepositoryReturnData, IVerificationTokenRepository, IVerificationTokenData } from '@/use-cases/verification-token/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';
import { IAddVerificationToken } from '@/use-cases/verification-token/add-verification-token/interfaces';

export class VerificationTokenRepository implements IVerificationTokenRepository {
  async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
    const userOrNull = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      include: {
        userHasRoles: {
          where: { roles: { isDeleted: false } },
          select: { roles: true },
        },
      },
    });
    return userOrNull ? { ...userOrNull, roles: getUserRoles(userOrNull.userHasRoles) } : null;
  }

  async findVerificationTokenByUserId(userId: string):
    Promise<IVerificationTokenRepositoryReturnData | null> {
    const emailVerificationTokenOrNull = await prisma.verificationToken.findFirst({
      where: { userId, isDeleted: false },
    });
    return emailVerificationTokenOrNull;
  }

  async deleteVerificationTokenByUserId(userId: string): Promise<void> {
    await prisma.verificationToken.updateMany({
      where: { userId, isDeleted: false },
      data: { isDeleted: true },
    });
  }

  async add({ userId, token, expiresInHours }: IAddVerificationToken):
    Promise<IVerificationTokenRepositoryReturnData> {
    const emailVerificationToken = await prisma.verificationToken.create({
      data: {
        userId,
        token,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (expiresInHours * 3600000)),
        isDeleted: false,
      },
    });
    return emailVerificationToken;
  }

  async updateUserVerification(userId: string, isVerified: boolean):
    Promise<IUserRepositoryReturnData> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified, updatedAt: new Date() },
      include: {
        userHasRoles: {
          where: { isDeleted: false, roles: { isDeleted: false } },
          select: { roles: true },
        },
      },
    });
    const { userHasRoles, ...userWithoutUserHasRoles } = user;
    return { ...userWithoutUserHasRoles, roles: getUserRoles(userHasRoles) };
  }
}
