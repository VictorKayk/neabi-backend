import { IRoleData } from '@/use-cases/role/interfaces';

export interface IRoleRepositoryReturnData extends IRoleData {
  createdAt: Date,
  updatedAt: Date,
}
