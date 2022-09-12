import { IAddToken } from '@/use-cases/interfaces';

export interface IAddVerificationToken extends IAddToken {
  verificationTokenId: string;
}
