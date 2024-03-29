import { IUserHasRoleData } from '@/use-cases/user-has-role/interfaces';

export interface IUserHasRoleRepositoryReturnData extends IUserHasRoleData {
  createdAt: Date,
  updatedAt: Date,
  isDeleted: boolean,
}
