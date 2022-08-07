import { IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import { IUserHasRoleData, IUserHasRoleRepositoryReturnData, IUserHasRoleEditableData } from '@/use-cases/user-has-role/interfaces';

export interface IUserHasRoleRepository {
  findUserById(userId: string): Promise<IUserRepositoryReturnData | null>
  findRoleById(idRole: string): Promise<IRoleRepositoryReturnData | null>
  findUserHasRole(userHasRole: IUserHasRoleData): Promise<IUserHasRoleRepositoryReturnData | null>
  addRoleToUser(userHasRole: IUserHasRoleData): Promise<IUserHasRoleRepositoryReturnData>
  removeRoleFromUser(userHasRole: IUserHasRoleData): Promise<IUserHasRoleRepositoryReturnData>
  updateRoleFromUser(
    userHasRole: IUserHasRoleData, userHasRoleEditableData: IUserHasRoleEditableData,
  ): Promise<IUserHasRoleRepositoryReturnData>
}
