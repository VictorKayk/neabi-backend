import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';

export type IUserCriticalData = Omit<IUserRepositoryReturnData, 'password'>
