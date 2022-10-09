import { IUrlData } from '@/use-cases/attachment/url/interfaces';

export interface IUrlRepositoryReturnData extends Omit<IUrlData, 'attachmentId'> {
  createdAt: Date,
  updatedAt: Date
}
