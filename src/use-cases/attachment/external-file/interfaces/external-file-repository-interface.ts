import {
  IReadExternalFileData,
  IExternalUserCredentials,
  IUserExternalFilePermissionReturnData,
  IUserExternalFile,
  IPublicUserExternalFileData,
} from '@/use-cases/attachment/external-file/interfaces';

export interface IExternalFileRepository {
  setCredentialToDrive(credentials?: IExternalUserCredentials): void;
  readAllUserExternalFiles(): Promise<IReadExternalFileData[] | []>
  addPublicVisibilityToUserExternalFile(fileId: string):
    Promise<IUserExternalFilePermissionReturnData>
  copyUserExternalFile(fileId: string): Promise<IUserExternalFile>
  readPublicUserExternalFileData(fileId: string): Promise<IPublicUserExternalFileData>
}
