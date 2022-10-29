import { IAttachmentRepositoryReturnData } from '@/use-cases/attachment/interfaces';
import { IPostRepositoryReturnData } from '@/use-cases/post/interfaces';
import { IPostHasAttachmentData, IPostHasAttachmentRepositoryReturnData } from '@/use-cases/post-has-attachment/interfaces';

export interface IPostHasAttachmentRepository {
  findPostById(postId: string): Promise<IPostRepositoryReturnData | null>
  findAttachmentById(idAttachment: string): Promise<IAttachmentRepositoryReturnData | null>
  findPostHasAttachment(postHasAttachment: IPostHasAttachmentData):
    Promise<IPostHasAttachmentRepositoryReturnData | null>
  addAttachmentToPost(postHasAttachment: IPostHasAttachmentData):
    Promise<IPostHasAttachmentRepositoryReturnData>
  removeAttachmentFromPost(postHasAttachment: IPostHasAttachmentData):
  Promise<IPostHasAttachmentRepositoryReturnData>
}
