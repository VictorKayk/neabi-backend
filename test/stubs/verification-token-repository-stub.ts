import { UserBuilder } from '@/test/builders/user-builder';
import { IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';
import { ITokenRepositoryReturnData } from '@/use-cases/interfaces';
import { IAddVerificationToken } from '@/use-cases/verification-token/add-verification-token/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export const makeVerificationTokenRepository = (): IVerificationTokenRepository => {
  class VerificationTokenRepositoryStub implements IVerificationTokenRepository {
    async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async findVerificationTokenByUserId(userId: string):
      Promise<ITokenRepositoryReturnData | null> {
      return null;
    }

    async deleteVerificationTokenByUserId(userId: string): Promise<void> {
      console.log();
    }

    async add(emailVerificationTokenData: IAddVerificationToken):
      Promise<ITokenRepositoryReturnData> {
      return {
        ...emailVerificationTokenData,
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      };
    }

    async updateUserVerification(userId: string, isVerified: boolean):
      Promise<IUserRepositoryReturnData> {
      const user = new UserBuilder();
      return {
        ...user.build(),
        id: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified,
        isDeleted: false,
        roles: [],
      };
    }
  }

  return new VerificationTokenRepositoryStub();
};
