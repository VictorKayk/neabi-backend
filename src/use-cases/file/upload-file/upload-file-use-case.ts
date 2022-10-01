import { IUniversallyUniqueIdentifierGenerator, IUseCase } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';
import { ExistingFileError } from '@/use-cases/file/errors';
import { IFileRepositoryReturnData, IFileRepository } from '@/use-cases/file/interfaces';
import { IUploadFileData } from '@/use-cases/file/upload-file/interfaces';

type Response = Either<ExistingFileError, IFileRepositoryReturnData>;

export class UploadFileUseCase implements IUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute({
    originalFileName, fileName, size, url,
  }: IUploadFileData): Promise<Response> {
    let fileOrNull = await this.fileRepository.findByFileName(fileName);
    if (fileOrNull) return error(new ExistingFileError());

    let id: string;
    do {
      id = await this.idGenerator.generate();
      fileOrNull = await this.fileRepository.findById(id);
    } while (fileOrNull);

    const fileData = await this.fileRepository.add({
      id, originalFileName, fileName, size, url,
    });

    return success(fileData);
  }
}
