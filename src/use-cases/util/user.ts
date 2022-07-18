import { IUserRepositoryData, IUserVisibleData } from '@/use-cases/interfaces';

export function getUserVisibleData(userData: IUserRepositoryData): IUserVisibleData {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    accessToken: userData.accessToken,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  };
}
