import { IUserData } from '@/use-cases/interfaces';

export interface IUserRepositoryReturnData extends IUserData {
  id: string,
  accessToken: string,
  createdAt: Date,
  updatedAt: Date,
}
