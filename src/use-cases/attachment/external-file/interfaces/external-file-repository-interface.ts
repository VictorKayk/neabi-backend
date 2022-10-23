import { IReadExternalFileData, IExternalUserCredentials } from '@/use-cases/attachment/external-file/interfaces';

export interface IExternalFileRepository {
  setCredentialToDrive(credentials?: IExternalUserCredentials): void;
  readAllUserExternalFiles(): Promise<IReadExternalFileData[] | []>
}
