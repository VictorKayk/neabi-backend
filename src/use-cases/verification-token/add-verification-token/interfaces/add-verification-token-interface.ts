import { IVerificationTokenData } from '@/use-cases/verification-token/interfaces';

export interface IAddVerificationToken extends IVerificationTokenData {
  expiresInHours: number,
}
