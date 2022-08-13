import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import { IUserVisibleData, IUserCriticalData } from '@/adapters/controllers/user/interfaces';

export function getUserVisibleData(userData: IUserRepositoryReturnData): IUserVisibleData {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    accessToken: userData.accessToken,
    isVerified: userData.isVerified,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  };
}

export function getUserCriticalData(userData: IUserRepositoryReturnData): IUserCriticalData {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    accessToken: userData.accessToken,
    isDeleted: userData.isDeleted,
    isVerified: userData.isVerified,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    roles: userData.roles,
  };
}
