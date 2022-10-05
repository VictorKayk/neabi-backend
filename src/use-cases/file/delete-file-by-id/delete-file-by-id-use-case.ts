import { IUseCase } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';
import { NonExistingFileError } from '@/use-cases/file/errors';
import { IFileRepositoryReturnData, IFileRepository } from '@/use-cases/file/interfaces';

type Response = Either<NonExistingFileError, IFileRepositoryReturnData>;

export class DeleteFileByIdUseCase implements IUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const fileOrNull = await this.fileRepository.findFileById(id);
    if (!fileOrNull) return error(new NonExistingFileError());

    const fileData = await this.fileRepository.deleteFileById(id);

    return success(fileData);
  }
}
