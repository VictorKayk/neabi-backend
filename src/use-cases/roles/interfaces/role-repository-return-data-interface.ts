import { IRoleData } from '@/use-cases/roles/interfaces';

export interface IRoleRepositoryReturnData extends IRoleData {
  createdAt: Date,
}
