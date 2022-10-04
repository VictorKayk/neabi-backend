import { IFileFormatRepositoryReturnData, IFileTypeRepositoryReturnData } from '@/use-cases/file/interfaces';

type Response = {
  fileFormat: Omit<IFileFormatRepositoryReturnData, 'isDeleted' | 'fileTypeId'>,
  fileType: Omit<IFileTypeRepositoryReturnData, 'isDeleted'>,
}
type IFileFormatAndFileType = {
  id: string,
  format: string,
  createdAt: Date,
  updatedAt: Date,
  FileType: Omit<IFileTypeRepositoryReturnData, 'isDeleted'>,
}

export function getFileTypeAndFileFormat({ FileType, ...FileFormat }: IFileFormatAndFileType):
  Response {
  return {
    fileFormat: FileFormat,
    fileType: FileType,
  };
}
