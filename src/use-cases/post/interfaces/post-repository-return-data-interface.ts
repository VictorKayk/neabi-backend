import { IPostData } from '@/use-cases/post/interfaces';

export interface IPostRepositoryReturnData extends IPostData {
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean,
}
