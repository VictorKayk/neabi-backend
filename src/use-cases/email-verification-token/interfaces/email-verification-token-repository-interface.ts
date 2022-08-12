import { IAddEmailVerificationToken } from '@/use-cases/email-verification-token/add-email-verification-token/interfaces/add-email-verification-token-interface';
import { IEmailValidationTokenRepositoryReturnData } from '@/use-cases/email-verification-token/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export interface IEmailVerificationTokenRepository {
  findUserById(userId: string): Promise<IUserRepositoryReturnData | null>
  findEmailValidationTokenByUserId(userId: string):
    Promise<IEmailValidationTokenRepositoryReturnData | null>
  deleteEmailValidationTokenByUserId(userId: string):
    Promise<IEmailValidationTokenRepositoryReturnData>
  add(emailValidationTokenData: IAddEmailVerificationToken):
    Promise<IEmailValidationTokenRepositoryReturnData>
}
