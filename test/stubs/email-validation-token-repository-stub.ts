import { IEmailValidationTokenData, IEmailValidationTokenRepositoryReturnData, IEmailVerificationTokenRepository } from '@/use-cases/email-verification-token/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export const makeEmailVerificationTokenRepository = (): IEmailVerificationTokenRepository => {
  class EmailVerificationTokenRepositoryStub implements IEmailVerificationTokenRepository {
    async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async findEmailValidationTokenByUserId(userId: string):
      Promise<IEmailValidationTokenRepositoryReturnData | null> {
      return null;
    }

    async deleteEmailValidationTokenByUserId(userId: string):
      Promise<IEmailValidationTokenRepositoryReturnData> {
      return {
        userId: 'any_userId',
        token: 'any_token',
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      };
    }

    async add(emailValidationTokenData: IEmailValidationTokenData):
      Promise<IEmailValidationTokenRepositoryReturnData> {
      return {
        ...emailValidationTokenData,
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      };
    }
  }

  return new EmailVerificationTokenRepositoryStub();
};
