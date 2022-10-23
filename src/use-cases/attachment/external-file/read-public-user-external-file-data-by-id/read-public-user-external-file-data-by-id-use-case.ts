import { IUseCase } from '@/use-cases/interfaces';
import { IUserExternalFile, IExternalFileRepository, IExternalUserCredentials } from '@/use-cases/attachment/external-file/interfaces';
import { Either, error, success } from '@/shared';
import { ReadPublicUserExternalFileDataError } from '@/use-cases/attachment/external-file/errors';

type Response = Either<ReadPublicUserExternalFileDataError, IUserExternalFile>;
type Request = {
  credentials: IExternalUserCredentials,
  fileId: string,
};

export class ReadPublicUserExternalFileDataByIdUseCase implements IUseCase {
  constructor(
    private readonly externalFilesRepository: IExternalFileRepository,
  ) { }

  async execute({ credentials, fileId }: Request): Promise<Response> {
    try {
      this.externalFilesRepository.setCredentialToDrive(credentials);

      const externalFile = await this.externalFilesRepository
        .readPublicUserExternalFileData(fileId);

      return success(externalFile);
    } catch (e: any) {
      return error(new ReadPublicUserExternalFileDataError(e.message));
    }
  }
}
