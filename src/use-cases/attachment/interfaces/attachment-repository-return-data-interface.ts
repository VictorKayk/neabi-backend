import { IAttachmentData } from '@/use-cases/attachment/interfaces';

export interface IAttachmentRepositoryReturnData extends IAttachmentData {
  createdAt: Date,
  updatedAt: Date
}
