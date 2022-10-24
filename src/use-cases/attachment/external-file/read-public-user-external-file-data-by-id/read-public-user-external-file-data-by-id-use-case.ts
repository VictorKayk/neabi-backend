import { IUseCase } from '@/use-cases/interfaces';
import { IPublicUserExternalFileData, IExternalFileRepository, IExternalUserCredentials } from '@/use-cases/attachment/external-file/interfaces';
import { Either, error, success } from '@/shared';
import { ReadPublicUserExternalFileDataError } from '@/use-cases/attachment/external-file/errors';

type Response = Either<ReadPublicUserExternalFileDataError, IPublicUserExternalFileData>;
type Request = {
  credentials: IExternalUserCredentials,
  externalId: string,
};

export class ReadPublicUserExternalFileDataByIdUseCase implements IUseCase {
  constructor(
    private readonly externalFilesRepository: IExternalFileRepository,
  ) { }

  async execute({ credentials, externalId }: Request): Promise<Response> {
    try {
      this.externalFilesRepository.setCredentialToDrive(credentials);

      const externalFile = await this.externalFilesRepository
        .readPublicUserExternalFileData(externalId);

      return success(externalFile);
    } catch (e: any) {
      return error(new ReadPublicUserExternalFileDataError(e.message));
    }
  }
}
