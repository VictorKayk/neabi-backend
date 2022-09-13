import { IAddResetUserPasswordToken } from '@/use-cases/user/reset-user-password/add-reset-user-password-token/interfaces';
import { ITokenRepositoryReturnData } from '@/use-cases/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export interface IResetUserPasswordTokenRepository {
  findUserById(userId: string): Promise<IUserRepositoryReturnData | null>
  findResetUserPasswordTokenByUserId(userId: string):
    Promise<ITokenRepositoryReturnData | null>
  deleteResetUserPasswordTokenByUserId(userId: string): Promise<void>
  add(resetUserPasswordTokenData: IAddResetUserPasswordToken):
    Promise<ITokenRepositoryReturnData>
  updateUserResetUserPassword(userId: string, isVerified: boolean):
    Promise<IUserRepositoryReturnData>
}
