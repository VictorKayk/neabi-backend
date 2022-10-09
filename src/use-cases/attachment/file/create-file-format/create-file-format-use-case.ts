import { IUniversallyUniqueIdentifierGenerator, IUseCase } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';
import { ExistingFileFormatError, NonExistingFileTypeError } from '@/use-cases/attachment/file/errors';
import { IFileFormatRepositoryReturnData, IFileRepository } from '@/use-cases/attachment/file/interfaces';

type Response = Either<ExistingFileFormatError, IFileFormatRepositoryReturnData>;
type Request = {
  format: string,
  fileTypeId: string,
}

export class CreateFileFormatUseCase implements IUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute({ format, fileTypeId }: Request): Promise<Response> {
    const fileTypeOrNull = await this.fileRepository.findTypeById(fileTypeId);
    if (!fileTypeOrNull) return error(new NonExistingFileTypeError());

    let fileFormatOrNull = await this.fileRepository.findFileFormatByFormat(format);
    if (fileFormatOrNull) {
      if (fileFormatOrNull.isDeleted) return error(new ExistingFileFormatError());

      const fileData = await this.fileRepository
        .updateFileFormatById(fileFormatOrNull.id, { isDeleted: false });
      return success(fileData);
    }

    let id: string;
    do {
      id = await this.idGenerator.generate();
      fileFormatOrNull = await this.fileRepository.findFormatById(id);
    } while (fileFormatOrNull);

    const fileData = await this.fileRepository.addFileFormat(id, format, fileTypeId);

    return success(fileData);
  }
}
