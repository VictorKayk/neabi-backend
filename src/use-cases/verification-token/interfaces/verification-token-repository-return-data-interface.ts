import { IVerificationTokenData } from '@/use-cases/verification-token/interfaces';

export interface IVerificationTokenRepositoryReturnData extends IVerificationTokenData {
  createdAt: Date,
  expiresAt: Date,
  isDeleted: boolean,
}
