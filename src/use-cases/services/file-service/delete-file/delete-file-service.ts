import { IUseCase } from '@/use-cases/interfaces';
import { Either, success, error } from '@/shared';
import { DeleteFileServiceError } from '@/use-cases/services/file-service/errors';
import { IFileService } from '@/use-cases/services/file-service/interfaces';

type Response = Either<DeleteFileServiceError, null>;

export class DeleteFileService implements IUseCase {
  constructor(
    private readonly fileService: IFileService,
  ) { }

  async execute(fileName: string): Promise<Response> {
    try {
      await this.fileService.delete(fileName);

      return success(null);
    } catch (e) {
      return error(new DeleteFileServiceError());
    }
  }
}
