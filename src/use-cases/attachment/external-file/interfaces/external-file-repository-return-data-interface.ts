import { IExternalFileData } from '@/use-cases/attachment/external-file/interfaces';
import { IFileFormatRepositoryReturnData, IFileTypeRepositoryReturnData } from '@/use-cases/attachment/file/interfaces';

export interface IExternalFileRepositoryReturnData extends Omit<IExternalFileData, 'fileFormatId' | 'attachmentId'> {
  createdAt: Date,
  updatedAt: Date,
  fileFormat: Omit<IFileFormatRepositoryReturnData, 'isDeleted' | 'fileTypeId'>,
  fileType: Omit<IFileTypeRepositoryReturnData, 'isDeleted'>,
}
