import { IPostHasTagData } from '@/use-cases/post-has-tag/interfaces';

export interface IPostHasTagRepositoryReturnData extends IPostHasTagData {
  createdAt: Date,
  updatedAt: Date,
}
