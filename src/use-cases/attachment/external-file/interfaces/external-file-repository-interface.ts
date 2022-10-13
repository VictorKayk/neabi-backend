import { IReadExternalFileData } from '@/use-cases/attachment/external-file/interfaces';

export interface IExternalFileRepository {
  readAllExternalFiles(): Promise<IReadExternalFileData[] | []>
}
