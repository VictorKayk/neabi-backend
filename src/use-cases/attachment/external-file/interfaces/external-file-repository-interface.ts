import { IReadExternalFileData, IExternalUserCredentials, IUserExternalFilePermissionReturnData } from '@/use-cases/attachment/external-file/interfaces';

export interface IExternalFileRepository {
  setCredentialToDrive(credentials?: IExternalUserCredentials): void;
  readAllUserExternalFiles(): Promise<IReadExternalFileData[] | []>
  addPublicVisibilityToUserExternalFile(fileId: string):
    Promise<IUserExternalFilePermissionReturnData>
}
