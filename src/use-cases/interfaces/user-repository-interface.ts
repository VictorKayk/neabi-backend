import { IUserRepositoryData, IUserEditableData } from '@/use-cases/interfaces';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUserRepositoryData | null>
  findById(id: string): Promise<IUserRepositoryData | null>
  add(userData: IUserRepositoryData): Promise<IUserRepositoryData>
  updateByEmail(email: string, userData: IUserEditableData): Promise<IUserRepositoryData>
}