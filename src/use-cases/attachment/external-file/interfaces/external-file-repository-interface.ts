import {
  IReadExternalFileData,
  IExternalUserCredentials,
  IUserExternalFilePermissionReturnData,
  IUserExternalFile,
} from '@/use-cases/attachment/external-file/interfaces';

export interface IExternalFileRepository {
  setCredentialToDrive(credentials?: IExternalUserCredentials): void;
  readAllUserExternalFiles(): Promise<IReadExternalFileData[] | []>
  addPublicVisibilityToUserExternalFile(fileId: string):
    Promise<IUserExternalFilePermissionReturnData>
  copyUserExternalFile(fileId: string): Promise<IUserExternalFile>
}
