import { IFileData } from '@/use-cases/file/interfaces';

export interface IFileRepositoryReturnData extends IFileData {
  createdAt: Date,
  updatedAt: Date,
  isDeleted: boolean,
}
