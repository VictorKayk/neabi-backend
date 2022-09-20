import { IAddToken } from '@/use-cases/user/interfaces';

export interface IAddResetUserPasswordToken extends IAddToken {
  resetUserPasswordTokenId: string;
}
