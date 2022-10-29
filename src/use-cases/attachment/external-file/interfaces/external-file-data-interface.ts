import { IPublicUserExternalFileData } from '@/use-cases/attachment/external-file/interfaces';

export interface IExternalFileData extends Omit<IPublicUserExternalFileData, 'mimeType'> {
  id: string,
  fileFormatId: string,
  attachmentId: string,
}
