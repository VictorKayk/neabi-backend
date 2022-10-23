import { IUseCase } from '@/use-cases/interfaces';
import { IUserExternalFile, IExternalFileRepository, IExternalUserCredentials } from '@/use-cases/attachment/external-file/interfaces';
import { Either, error, success } from '@/shared';
import { CopyUserExternalFileError } from '@/use-cases/attachment/external-file/errors';

type Response = Either<CopyUserExternalFileError, IUserExternalFile>;
type Request = {
  credentials: IExternalUserCredentials,
  fileId: string,
};

export class CopyUserExternalFileUseCase implements IUseCase {
  constructor(
    private readonly externalFilesRepository: IExternalFileRepository,
  ) { }

  async execute({ credentials, fileId }: Request): Promise<Response> {
    try {
      this.externalFilesRepository.setCredentialToDrive(credentials);

      const externalFile = await this.externalFilesRepository.copyUserExternalFile(fileId);

      return success(externalFile);
    } catch (e) {
      return error(new CopyUserExternalFileError());
    }
  }
}
