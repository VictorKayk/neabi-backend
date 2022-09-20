import { ITokenData } from '@/use-cases/user/interfaces';

export interface IAddToken extends ITokenData {
  expiresInHours: number,
}
