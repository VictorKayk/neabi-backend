import {
  IPostRepositoryReturnData, IPostData, IPostDataQuery, IPostEditableData,
} from '@/use-cases/post/interfaces';

export interface IPostRepository {
    findBySlug(slug: string): Promise<IPostRepositoryReturnData | null>
    findById(id: string): Promise<IPostRepositoryReturnData | null>
    add(postData: IPostData): Promise<IPostRepositoryReturnData>
    readAllPosts(postDataQuery: IPostDataQuery): Promise<IPostRepositoryReturnData[] | []>
    updateById(id: string, postEditableData: IPostEditableData): Promise<IPostRepositoryReturnData>
    deleteById(id: string): Promise<IPostRepositoryReturnData>
}
