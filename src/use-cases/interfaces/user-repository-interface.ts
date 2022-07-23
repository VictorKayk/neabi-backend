import { IUserRepositoryReturnData, IUserRepositoryData, IUserEditableData } from '@/use-cases/interfaces';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUserRepositoryReturnData | null>
  findById(id: string): Promise<IUserRepositoryReturnData | null>
  add(userData: IUserRepositoryData): Promise<IUserRepositoryReturnData>
  updateByEmail(email: string, userData: IUserEditableData): Promise<IUserRepositoryReturnData>
  updateById(id: string, userData: IUserEditableData): Promise<IUserRepositoryReturnData>
  deleteById(id: string): Promise<IUserRepositoryReturnData>
}
