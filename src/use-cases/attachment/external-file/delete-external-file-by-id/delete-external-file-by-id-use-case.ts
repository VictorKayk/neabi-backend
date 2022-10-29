import { IUseCase } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';
import { NonExistingExternalFileError } from '@/use-cases/attachment/external-file/errors';
import { IExternalFileRepositoryReturnData, IExternalFileRepository } from '@/use-cases/attachment/external-file/interfaces';

type Response = Either<NonExistingExternalFileError, IExternalFileRepositoryReturnData>;

export class DeleteExternalFileByIdUseCase implements IUseCase {
  constructor(
    private readonly externalFileRepository: IExternalFileRepository,
  ) { }

  async execute(fileId: string): Promise<Response> {
    const externalFileOrNull = await this.externalFileRepository.findExternalFileById(fileId);
    if (!externalFileOrNull) return error(new NonExistingExternalFileError());

    const externalFileData = await this.externalFileRepository.deleteExternalFileById(fileId);

    return success(externalFileData);
  }
}
