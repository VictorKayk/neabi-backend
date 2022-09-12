import { ITokenData } from '@/use-cases/interfaces';

export interface ITokenRepositoryReturnData extends ITokenData {
  createdAt: Date,
  expiresAt: Date,
  isDeleted: boolean,
}
