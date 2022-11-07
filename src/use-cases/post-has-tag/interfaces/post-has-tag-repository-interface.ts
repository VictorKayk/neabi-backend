import { ITagRepositoryReturnData } from '@/use-cases/tag/interfaces';
import { IPostRepositoryReturnData } from '@/use-cases/post/interfaces';
import { IPostHasTagData, IPostHasTagRepositoryReturnData } from '@/use-cases/post-has-tag/interfaces';

export interface IPostHasTagRepository {
  findPostById(postId: string): Promise<IPostRepositoryReturnData | null>
  findTagById(idTag: string): Promise<ITagRepositoryReturnData | null>
  findPostHasTag(postHasTag: IPostHasTagData):
    Promise<IPostHasTagRepositoryReturnData | null>
  addTagToPost(postHasTag: IPostHasTagData):
    Promise<IPostHasTagRepositoryReturnData>
}
