import { IAddToken } from '@/use-cases/user/interfaces';

export interface IAddVerificationToken extends IAddToken {
  verificationTokenId: string;
}
