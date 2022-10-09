import { IFileTypeData } from '@/use-cases/attachment/file/interfaces';

export interface IFileTypeRepositoryReturnData extends IFileTypeData {
  createdAt: Date,
  updatedAt: Date,
  isDeleted: boolean,
}
