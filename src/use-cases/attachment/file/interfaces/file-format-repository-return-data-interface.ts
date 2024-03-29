import { IFileFormatData } from '@/use-cases/attachment/file/interfaces';

export interface IFileFormatRepositoryReturnData extends IFileFormatData {
  fileTypeId: string,
  createdAt: Date,
  updatedAt: Date,
  isDeleted: boolean,
}
