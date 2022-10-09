import { IUniversallyUniqueIdentifierGenerator, IUseCase } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';
import { ExistingFileTypeError } from '@/use-cases/attachment/file/errors';
import { IFileTypeRepositoryReturnData, IFileRepository } from '@/use-cases/attachment/file/interfaces';

type Response = Either<ExistingFileTypeError, IFileTypeRepositoryReturnData>;

export class CreateFileTypeUseCase implements IUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute(type: string): Promise<Response> {
    let fileTypeOrNull = await this.fileRepository.findFileTypeByType(type);
    if (fileTypeOrNull) {
      if (fileTypeOrNull.isDeleted) return error(new ExistingFileTypeError());

      const fileData = await this.fileRepository
        .updateFileTypeById(fileTypeOrNull.id, { isDeleted: false });
      return success(fileData);
    }

    let id: string;
    do {
      id = await this.idGenerator.generate();
      fileTypeOrNull = await this.fileRepository.findTypeById(id);
    } while (fileTypeOrNull);

    const fileData = await this.fileRepository.addFileType(id, type);

    return success(fileData);
  }
}
