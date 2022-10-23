import { IUserExternalFile } from '@/use-cases/attachment/external-file/interfaces';

export interface IPublicUserExternalFileData extends IUserExternalFile {
  contentLink?: string,
  viewLink?: string,
  size?: string,
  originalFileName: string,
}
