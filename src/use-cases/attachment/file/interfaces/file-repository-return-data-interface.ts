import { IFileData, IFileFormatRepositoryReturnData, IFileTypeRepositoryReturnData } from '@/use-cases/attachment/file/interfaces';

export interface IFileRepositoryReturnData extends Omit<IFileData, 'fileFormatId'> {
  createdAt: Date,
  updatedAt: Date,
  fileFormat: Omit<IFileFormatRepositoryReturnData, 'isDeleted' | 'fileTypeId'>,
  fileType: Omit<IFileTypeRepositoryReturnData, 'isDeleted'>,
}
