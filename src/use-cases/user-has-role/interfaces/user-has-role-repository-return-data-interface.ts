import { IUserHasRoleData } from '@/use-cases/user-has-role/interfaces';

export interface IUserHasRoleRepositoryReturnData extends IUserHasRoleData {
  createdAt: Date,
  isDeleted: boolean,
}
