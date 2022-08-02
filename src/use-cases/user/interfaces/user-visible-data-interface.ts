import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';

export interface IUserVisibleData {
  id: string,
  name: string,
  email: string,
  accessToken: string,
  createdAt: Date,
  updatedAt: Date,
  roles?: [] | Array<IRoleRepositoryReturnData>
}
