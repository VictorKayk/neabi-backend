import { ITokenData } from '@/use-cases/user/interfaces';

export interface ITokenRepositoryReturnData extends ITokenData {
  createdAt: Date,
  expiresAt: Date,
  isDeleted: boolean,
}
