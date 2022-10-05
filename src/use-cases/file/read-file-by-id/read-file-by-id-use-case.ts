import { IUseCase } from '@/use-cases/interfaces';
import { IFileRepositoryReturnData, IFileRepository } from '@/use-cases/file/interfaces';
import { NonExistingFileError } from '@/use-cases/file/errors';

import { Either, error, success } from '@/shared';

type Response = Either<NonExistingFileError, IFileRepositoryReturnData>;

export class ReadFileByIdUseCase implements IUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const fileOrNull = await this.fileRepository.findById(id);
    if (!fileOrNull) return error(new NonExistingFileError());
    return success(fileOrNull);
  }
}
