import { IRoleData, IRoleRepositoryReturnData } from '@/use-cases/role/interfaces';

export interface IRoleRepository {
  findByRole(role: string): Promise<IRoleRepositoryReturnData | null>
  findById(id: string): Promise<IRoleRepositoryReturnData | null>
  add(roleData: IRoleData): Promise<IRoleRepositoryReturnData>
}
