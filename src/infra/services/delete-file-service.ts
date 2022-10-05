import { unlinkSync } from 'fs';
import { IDeleteFileService } from '@/use-cases/services/file-service/interfaces';

export class DeleteFileService implements IDeleteFileService {
  constructor(
    private readonly path: string,
  ) { }

  async delete(fileName: string): Promise<null> {
    unlinkSync(`${this.path}/${fileName}`);
    return null;
  }
}
