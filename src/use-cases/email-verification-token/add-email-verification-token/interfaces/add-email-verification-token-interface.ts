import { IEmailValidationTokenData } from '@/use-cases/email-verification-token/interfaces';

export interface IAddEmailVerificationToken extends IEmailValidationTokenData {
  expiresInHours: number,
}
