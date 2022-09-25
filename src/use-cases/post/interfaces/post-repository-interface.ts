import { IPostRepositoryReturnData, IPostData } from '@/use-cases/post/interfaces';

export interface IPostRepository {
    findBySlug(slug: string): Promise<IPostRepositoryReturnData | null>
    findById(id: string): Promise<IPostRepositoryReturnData | null>
    add(postData: IPostData): Promise<IPostRepositoryReturnData>
}
