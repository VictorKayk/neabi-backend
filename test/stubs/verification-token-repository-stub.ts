import { IVerificationTokenData, IVerificationTokenRepositoryReturnData, IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export const makeVerificationTokenRepository = (): IVerificationTokenRepository => {
  class VerificationTokenRepositoryStub implements IVerificationTokenRepository {
    async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async findVerificationTokenByUserId(userId: string):
      Promise<IVerificationTokenRepositoryReturnData | null> {
      return null;
    }

    async deleteVerificationTokenByUserId(userId: string):
      Promise<IVerificationTokenRepositoryReturnData> {
      return {
        userId: 'any_userId',
        token: 'any_token',
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      };
    }

    async add(emailVerificationTokenData: IVerificationTokenData):
      Promise<IVerificationTokenRepositoryReturnData> {
      return {
        ...emailVerificationTokenData,
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      };
    }
  }

  return new VerificationTokenRepositoryStub();
};
