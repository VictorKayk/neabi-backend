import { IUserData } from '@/use-cases/user/interfaces';
import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';

export interface IUserRepositoryReturnData extends IUserData {
  id: string,
  accessToken: string,
  createdAt: Date,
  updatedAt: Date,
  roles?: [] | Array<IRoleRepositoryReturnData>
}
