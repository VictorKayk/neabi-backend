import { IUserData } from '@/use-cases/interfaces';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUserData | null>
  findById(id: string): Promise<IUserData | null>
  add(userData: IUserData): Promise<IUserData>
}
