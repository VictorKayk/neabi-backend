import { IUserData } from '@/use-cases/user/interfaces';

export interface IUserRepositoryData extends IUserData {
  id: string,
  accessToken: string,
}
