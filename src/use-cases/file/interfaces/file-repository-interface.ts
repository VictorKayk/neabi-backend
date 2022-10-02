import {
  IFileRepositoryReturnData, IFileData, IFileTypeRepositoryReturnData,
} from '@/use-cases/file/interfaces';

export interface IFileRepository {
    findByFileName(fileName: string): Promise<IFileRepositoryReturnData | null>
    findById(id: string): Promise<IFileRepositoryReturnData | null>
    add(fileData: IFileData): Promise<IFileRepositoryReturnData>
    findFileTypeByType(id: string): Promise<IFileTypeRepositoryReturnData | null>
    addFileType(id: string, type: string): Promise<IFileTypeRepositoryReturnData>
    findTypeById(id: string): Promise<IFileTypeRepositoryReturnData | null>
}
