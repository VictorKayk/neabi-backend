import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';
import { IUserData } from '@/use-cases/user/interfaces';

export interface IUserRepositoryReturnData extends IUserData {
  id: string,
  accessToken: string,
  createdAt: Date,
  updatedAt: Date,
  isDeleted: boolean,
  roles: [] | IRoleRepositoryReturnData[],
}
