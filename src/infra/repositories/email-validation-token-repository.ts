import { getUserRoles } from '@/infra/repositories/utils';
import { IEmailValidationTokenRepositoryReturnData, IEmailVerificationTokenRepository } from '@/use-cases/email-verification-token/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import prisma from '@/main/config/prisma';
import { IAddEmailVerificationToken } from '@/use-cases/email-verification-token/add-email-verification-token/interfaces';

export class EmailVerificationTokenRepository implements IEmailVerificationTokenRepository {
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

  async findEmailValidationTokenByUserId(userId: string):
    Promise<IEmailValidationTokenRepositoryReturnData | null> {
    const emailValidationTokenOrNull = await prisma.emailVerificationToken.findFirst({
      where: { userId },
    });
    return emailValidationTokenOrNull;
  }

  async deleteEmailValidationTokenByUserId(userId: string):
    Promise<IEmailValidationTokenRepositoryReturnData> {
    const emailValidationToken = await prisma.emailVerificationToken.update({
      where: { userId },
      data: { isDeleted: true },
    });
    return emailValidationToken;
  }

  async add({ userId, token, expiresInHours }: IAddEmailVerificationToken):
    Promise<IEmailValidationTokenRepositoryReturnData> {
    const emailValidationToken = await prisma.emailVerificationToken.create({
      data: {
        userId,
        token,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (expiresInHours * 3600000)),
        isDeleted: false,
      },
    });
    return emailValidationToken;
  }
}
