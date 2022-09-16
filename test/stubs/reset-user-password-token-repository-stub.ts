import { UserBuilder } from '@/test/builders/user-builder';
import { IResetUserPasswordTokenRepository } from '@/use-cases/user/reset-user-password/interfaces';
import { ITokenRepositoryReturnData } from '@/use-cases/interfaces';
import { IAddResetUserPasswordToken } from '@/use-cases/user/reset-user-password/add-reset-user-password-token/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export const makeResetUserPasswordTokenRepository = (): IResetUserPasswordTokenRepository => {
  class ResetUserPasswordTokenRepositoryStub implements IResetUserPasswordTokenRepository {
    async findUserById(userId: string): Promise<IUserRepositoryReturnData | null> {
      return null;
    }

    async findResetUserPasswordTokenByUserId(userId: string):
      Promise<ITokenRepositoryReturnData | null> {
      return null;
    }

    async deleteResetUserPasswordTokenByUserId(userId: string): Promise<void> {
      console.log(userId);
    }

    async add(resetUserPasswordTokenData: IAddResetUserPasswordToken):
      Promise<ITokenRepositoryReturnData> {
      return {
        ...resetUserPasswordTokenData,
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      };
    }

    async updateUserResetUserPassword(userId: string, isVerified: boolean):
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

  return new ResetUserPasswordTokenRepositoryStub();
};
