import { IPostHasAttachmentData } from '@/use-cases/post-has-attachment/interfaces';

export interface IPostHasAttachmentRepositoryReturnData extends IPostHasAttachmentData {
  createdAt: Date,
  updatedAt: Date,
}
