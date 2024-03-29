import { IUseCase } from '@/use-cases/interfaces';
import { IUserExternalFile, IExternalFileRepository, IExternalUserCredentials } from '@/use-cases/attachment/external-file/interfaces';
import { Either, error, success } from '@/shared';
import { CopyUserExternalFileError } from '@/use-cases/attachment/external-file/errors';

type Response = Either<CopyUserExternalFileError, IUserExternalFile>;
type Request = {
  credentials: IExternalUserCredentials,
  externalId: string,
};

export class CopyUserExternalFileUseCase implements IUseCase {
  constructor(
    private readonly externalFilesRepository: IExternalFileRepository,
  ) { }

  async execute({ credentials, externalId }: Request): Promise<Response> {
    try {
      this.externalFilesRepository.setCredentialToDrive(credentials);

      const externalFile = await this.externalFilesRepository.copyUserExternalFile(externalId);

      return success(externalFile);
    } catch (e: any) {
      return error(new CopyUserExternalFileError(e.message));
    }
  }
}
