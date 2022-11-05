import { ITagData } from '@/use-cases/tag/interfaces';

export interface ITagRepositoryReturnData extends ITagData {
  createdAt: Date,
  updatedAt: Date,
  isDeleted: boolean,
}
