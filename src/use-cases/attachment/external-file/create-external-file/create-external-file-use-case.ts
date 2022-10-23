import { IUniversallyUniqueIdentifierGenerator, IUseCase } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';
import { ExistingExternalFileError } from '@/use-cases/attachment/external-file/errors';
import { IExternalFileRepository, IExternalFileData } from '@/use-cases/attachment/external-file/interfaces';

type Response = Either<ExistingExternalFileError, IExternalFileData>;

export class CreateExternalFileUseCase implements IUseCase {
  constructor(
    private readonly externalFileRepository: IExternalFileRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute({
    name, size, url, fileId, downloadUrl, originalFileName, fileFormatId,
  }: Omit<IExternalFileData, 'attachmentId' | 'id'>): Promise<Response> {
    let fileOrNull = await this.externalFileRepository.findExternalFileByFileId(fileId);
    if (fileOrNull) return error(new ExistingExternalFileError());

    let attachmentId: string;
    let attachmentOrNull;
    do {
      attachmentId = await this.idGenerator.generate();
      attachmentOrNull = await this.externalFileRepository.findAttachmentById(attachmentId);
    } while (attachmentOrNull);

    let id: string;
    do {
      id = await this.idGenerator.generate();
      fileOrNull = await this.externalFileRepository.findExternalFileById(id);
    } while (fileOrNull);

    const fileData = await this.externalFileRepository.addExternalFile({
      id, fileId, originalFileName, name, size, url, downloadUrl, fileFormatId, attachmentId,
    });

    return success(fileData);
  }
}
