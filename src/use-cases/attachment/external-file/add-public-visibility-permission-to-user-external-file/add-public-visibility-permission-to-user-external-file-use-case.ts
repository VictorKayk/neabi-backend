import { IUseCase } from '@/use-cases/interfaces';
import { IUserExternalFilePermissionReturnData, IExternalFileRepository, IExternalUserCredentials } from '@/use-cases/attachment/external-file/interfaces';
import { Either, error, success } from '@/shared';
import { UserExternalFilePermissionError } from '@/use-cases/attachment/external-file/errors';

type Response = Either<UserExternalFilePermissionError, IUserExternalFilePermissionReturnData>;
type Request = {
  credentials: IExternalUserCredentials,
  fileId: string,
};

export class AddPublicVisibilityPermissitionToUserExternalFileUseCase implements IUseCase {
  constructor(
    private readonly externalFilesRepository: IExternalFileRepository,
  ) { }

  async execute({ credentials, fileId }: Request): Promise<Response> {
    try {
      this.externalFilesRepository.setCredentialToDrive(credentials);

      const externalFile = await this.externalFilesRepository
        .addPublicVisibilityToUserExternalFile(fileId);

      return success(externalFile);
    } catch (e) {
      return error(new UserExternalFilePermissionError());
    }
  }
}
