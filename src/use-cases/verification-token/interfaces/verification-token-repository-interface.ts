import { IAddVerificationToken } from '@/use-cases/verification-token/add-verification-token/interfaces';
import { ITokenRepositoryReturnData } from '@/use-cases/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export interface IVerificationTokenRepository {
  findUserById(userId: string): Promise<IUserRepositoryReturnData | null>
  findVerificationTokenByUserId(userId: string):
    Promise<ITokenRepositoryReturnData | null>
  deleteVerificationTokenByUserId(userId: string): Promise<void>
  add(emailVerificationTokenData: IAddVerificationToken):
    Promise<ITokenRepositoryReturnData>
  updateUserVerification(userId: string, isVerified: boolean):
    Promise<IUserRepositoryReturnData>
}
