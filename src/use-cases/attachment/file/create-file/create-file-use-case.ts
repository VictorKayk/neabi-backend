import { IUniversallyUniqueIdentifierGenerator, IUseCase } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';
import { ExistingFileError } from '@/use-cases/attachment/file/errors';
import { IFileRepositoryReturnData, IFileRepository } from '@/use-cases/attachment/file/interfaces';
import { ICreateFileData } from '@/use-cases/attachment/file/create-file/interfaces';

type Response = Either<ExistingFileError, IFileRepositoryReturnData>;

export class CreateFileUseCase implements IUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute({
    originalFileName, name, size, url, fileFormatId,
  }: ICreateFileData): Promise<Response> {
    let fileOrNull = await this.fileRepository.findFileByName(name);
    if (fileOrNull) return error(new ExistingFileError());

    let attachmentId: string;
    let attachmentOrNull;
    do {
      attachmentId = await this.idGenerator.generate();
      attachmentOrNull = await this.fileRepository.findAttachmentById(attachmentId);
    } while (attachmentOrNull);

    let id: string;
    do {
      id = await this.idGenerator.generate();
      fileOrNull = await this.fileRepository.findById(id);
    } while (fileOrNull);

    const fileData = await this.fileRepository.add({
      id, originalFileName, name, size, url, fileFormatId, attachmentId,
    });

    return success(fileData);
  }
}
