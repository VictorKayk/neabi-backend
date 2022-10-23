import { IUserExternalFile } from '@/use-cases/attachment/external-file/interfaces';

export interface IPublicUserExternalFileData extends IUserExternalFile {
  downloadUrl?: string,
  url?: string,
  size?: string,
  originalFileName: string,
}
