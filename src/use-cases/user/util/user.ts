import { IUserRepositoryReturnData, IUserVisibleData } from '@/use-cases/user/interfaces';

export function getUserVisibleData(userData: IUserRepositoryReturnData): IUserVisibleData {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    accessToken: userData.accessToken,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    roles: userData?.roles,
  };
}
