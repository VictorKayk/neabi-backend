import { IUseCase } from '@/use-cases/interfaces';
import { Either, success, error } from '@/shared';
import { DeleteFileServiceError } from '@/use-cases/services/file-service/errors';
import { IDeleteFileService } from '@/use-cases/services/file-service/interfaces';

type Response = Either<DeleteFileServiceError, null>;

export class DeleteFileService implements IUseCase {
  constructor(
    private readonly deleteFileService: IDeleteFileService,
  ) { }

  async execute(fileName: string): Promise<Response> {
    try {
      await this.deleteFileService.delete(fileName);

      return success(null);
    } catch (e) {
      return error(new DeleteFileServiceError());
    }
  }
}
