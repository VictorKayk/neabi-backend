import { IUrlData } from '@/use-cases/attachment/url/interfaces';

export interface IUrlRepositoryReturnData extends IUrlData {
  createdAt: Date,
  updatedAt: Date
}
