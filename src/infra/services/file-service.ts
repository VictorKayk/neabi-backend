import { unlinkSync } from 'fs';
import { IFileService } from '@/use-cases/services/file-service/interfaces';

export class FileService implements IFileService {
  constructor(
    private readonly path: string,
  ) { }

  async delete(fileName: string): Promise<null> {
    unlinkSync(`${this.path}/${fileName}`);
    return null;
  }
}
