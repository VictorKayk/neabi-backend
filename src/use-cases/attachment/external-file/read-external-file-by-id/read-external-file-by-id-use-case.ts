import { IUseCase } from '@/use-cases/interfaces';
import { IExternalFileRepositoryReturnData, IExternalFileRepository } from '@/use-cases/attachment/external-file/interfaces';
import { NonExistingExternalFileError } from '@/use-cases/attachment/external-file/errors';

import { Either, error, success } from '@/shared';

type Response = Either<NonExistingExternalFileError, IExternalFileRepositoryReturnData>;

export class ReadExternalFileByIdUseCase implements IUseCase {
  constructor(
    private readonly externalFileRepository: IExternalFileRepository,
  ) { }

  async execute(fileId: string): Promise<Response> {
    const externalFileOrNull = await this.externalFileRepository.findExternalFileByFileId(fileId);
    if (!externalFileOrNull) return error(new NonExistingExternalFileError());
    return success(externalFileOrNull);
  }
}
