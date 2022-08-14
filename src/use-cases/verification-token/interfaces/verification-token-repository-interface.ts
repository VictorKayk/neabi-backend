import { IAddVerificationToken } from '@/use-cases/verification-token/add-verification-token/interfaces/add-verification-token-interface';
import { IVerificationTokenRepositoryReturnData } from '@/use-cases/verification-token/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export interface IVerificationTokenRepository {
  findUserById(userId: string): Promise<IUserRepositoryReturnData | null>
  findVerificationTokenByUserId(userId: string):
    Promise<IVerificationTokenRepositoryReturnData | null>
  deleteVerificationTokenByUserId(userId: string): Promise<void>
  add(emailVerificationTokenData: IAddVerificationToken):
    Promise<IVerificationTokenRepositoryReturnData>
}
