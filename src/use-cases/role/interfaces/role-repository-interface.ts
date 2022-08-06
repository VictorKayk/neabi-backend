import {
  IRoleData, IRoleRepositoryReturnData, IRoleDataQuery, IRoleEditableData,
} from '@/use-cases/role/interfaces';

export interface IRoleRepository {
  findByRole(role: string): Promise<IRoleRepositoryReturnData | null>
  findById(id: string): Promise<IRoleRepositoryReturnData | null>
  add(roleData: IRoleData): Promise<IRoleRepositoryReturnData>
  readAllRoles(roleDataQuery: IRoleDataQuery): Promise<IRoleRepositoryReturnData[] | []>
  deleteById(id: string): Promise<IRoleRepositoryReturnData>
  updateById(id: string, roleEditableData: IRoleEditableData): Promise<IRoleRepositoryReturnData>
}
