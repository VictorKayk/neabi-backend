import { IAttachmentRepositoryReturnData, IAttachmentDataQuery } from '@/use-cases/attachment/interfaces';
import { IPostRepositoryReturnData } from '@/use-cases/post/interfaces';
import { IPostHasAttachmentData, IPostHasAttachmentRepositoryReturnData } from '@/use-cases/post-has-attachment/interfaces';
import { IUrlRepositoryReturnData } from '@/use-cases/attachment/url/interfaces';
import { IFileFormatRepositoryReturnData } from '@/use-cases/attachment/file/interfaces';
import { IExternalFileRepositoryReturnData } from '@/use-cases/attachment/external-file/interfaces';

export interface IPostHasAttachmentRepository {
  findPostById(postId: string): Promise<IPostRepositoryReturnData | null>
  findAttachmentById(idAttachment: string): Promise<IAttachmentRepositoryReturnData | null>
  findPostHasAttachment(postHasAttachment: IPostHasAttachmentData):
    Promise<IPostHasAttachmentRepositoryReturnData | null>
  addAttachmentToPost(postHasAttachment: IPostHasAttachmentData):
    Promise<IPostHasAttachmentRepositoryReturnData>
  removeAttachmentFromPost(postHasAttachment: IPostHasAttachmentData):
  Promise<IPostHasAttachmentRepositoryReturnData>
  readAllAttachmentsFromPost(postId: string, attachmentDataQuery: IAttachmentDataQuery):
    Promise<{
      url: IUrlRepositoryReturnData[] | [],
      file: IFileFormatRepositoryReturnData[] | [],
      externalFile: IExternalFileRepositoryReturnData[] | [],
    }>
}
