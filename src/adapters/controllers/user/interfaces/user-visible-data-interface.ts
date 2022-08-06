import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export type IUserVisibleData = Omit<IUserRepositoryReturnData, 'password' | 'isDeleted' | 'roles'>
