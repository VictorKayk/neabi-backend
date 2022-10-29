import {
  IReadExternalFileData,
  IExternalUserCredentials,
  IUserExternalFilePermissionReturnData,
  IUserExternalFile,
  IPublicUserExternalFileData,
  IExternalFileRepositoryReturnData,
  IExternalFileData,
  IExternalFileDataQuery,
} from '@/use-cases/attachment/external-file/interfaces';
import { IAttachmentRepositoryReturnData } from '@/use-cases/attachment/interfaces';

export interface IExternalFileRepository {
  setCredentialToDrive(credentials?: IExternalUserCredentials): void;
  readAllUserExternalFiles(): Promise<IReadExternalFileData[] | []>
  addPublicVisibilityToUserExternalFile(fileId: string):
    Promise<IUserExternalFilePermissionReturnData>
  copyUserExternalFile(fileId: string): Promise<IUserExternalFile>
  readPublicUserExternalFileData(fileId: string): Promise<IPublicUserExternalFileData>
  findExternalFileByFileId(fileId: string): Promise<IExternalFileRepositoryReturnData | null>
  findAttachmentById(id: string): Promise<IAttachmentRepositoryReturnData | null>
  findExternalFileById(id: string): Promise<IExternalFileRepositoryReturnData | null>
  addExternalFile(externalFileData: IExternalFileData): Promise<IExternalFileRepositoryReturnData>
  readAllExternalFiles(externalFileDataQuery: IExternalFileDataQuery):
    Promise<IExternalFileRepositoryReturnData[] | []>
}
