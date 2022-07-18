import { IUserData } from '@/use-cases/interfaces';

export interface IUserRepositoryData extends IUserData {
  id: string,
  accessToken: string,
  createdAt: Date,
  updatedAt: Date,
}
