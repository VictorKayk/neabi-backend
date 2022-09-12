import { ITokenData } from '@/use-cases/interfaces';

export interface IAddToken extends ITokenData {
  expiresInHours: number,
}
