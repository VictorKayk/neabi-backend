import { IAddToken } from '@/use-cases/interfaces';

export interface IAddResetUserPasswordToken extends IAddToken {
  resetUserPasswordTokenId: string;
}
