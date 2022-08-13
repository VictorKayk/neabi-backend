import { getUserRoles } from '@/infra/repositories/utils';
import { IVerificationTokenRepositoryReturnData, IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';
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
      where: { userId },
    });
    return emailVerificationTokenOrNull;
  }

  async deleteVerificationTokenByUserId(userId: string):
    Promise<IVerificationTokenRepositoryReturnData> {
    const emailVerificationToken = await prisma.verificationToken.update({
      where: { userId },
      data: { isDeleted: true },
    });
    return emailVerificationToken;
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
}
