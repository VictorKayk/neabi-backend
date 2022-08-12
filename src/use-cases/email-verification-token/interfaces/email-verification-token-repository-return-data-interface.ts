import { IEmailValidationTokenData } from '@/use-cases/email-verification-token/interfaces';

export interface IEmailValidationTokenRepositoryReturnData extends IEmailValidationTokenData {
  createdAt: Date,
  expiresAt: Date,
  isDeleted: boolean,
}
