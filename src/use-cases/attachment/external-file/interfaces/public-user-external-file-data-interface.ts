import { IUserExternalFile } from '@/use-cases/attachment/external-file/interfaces';

export interface IPublicUserExternalFileData extends IUserExternalFile {
  downloadUrl: string | null,
  url: string,
  size: string | undefined | null,
  originalFileName: string | null,
}
