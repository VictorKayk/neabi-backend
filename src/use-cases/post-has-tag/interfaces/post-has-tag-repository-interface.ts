import { ITagDataQuery, ITagRepositoryReturnData } from '@/use-cases/tag/interfaces';
import { IPostDataQuery, IPostRepositoryReturnData } from '@/use-cases/post/interfaces';
import { IPostHasTagData, IPostHasTagRepositoryReturnData, IPostHasTagEditableData } from '@/use-cases/post-has-tag/interfaces';

export interface IPostHasTagRepository {
  findPostById(postId: string): Promise<IPostRepositoryReturnData | null>
  findTagById(idTag: string): Promise<ITagRepositoryReturnData | null>
  findPostHasTag(postHasTag: IPostHasTagData):
    Promise<IPostHasTagRepositoryReturnData | null>
  updateById(postHasTag: IPostHasTagData, postHasTagEditableData: IPostHasTagEditableData):
  Promise<IPostHasTagRepositoryReturnData>
  addTagToPost(postHasTag: IPostHasTagData):
    Promise<IPostHasTagRepositoryReturnData>
  readAllTagsFromPost(postId: string, tagDataQuery: ITagDataQuery):
    Promise<ITagRepositoryReturnData[] | []>
  readAllPostsFromTag(tagId: string, postDataQuery: IPostDataQuery):
    Promise<IPostRepositoryReturnData[] | []>
}
