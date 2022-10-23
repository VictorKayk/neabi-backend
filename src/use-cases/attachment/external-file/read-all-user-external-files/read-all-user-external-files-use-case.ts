import { IUseCase } from '@/use-cases/interfaces';
import { IReadExternalFileData, IExternalFileRepository, IExternalUserCredentials } from '@/use-cases/attachment/external-file/interfaces';

type Response = IReadExternalFileData[] | [];

export class ReadAllUserExternalFilesUseCase implements IUseCase {
  constructor(
    private readonly externalFilesRepository: IExternalFileRepository,
  ) { }

  async execute(credentials: IExternalUserCredentials): Promise<Response> {
    this.externalFilesRepository.setCredentialToDrive(credentials);

    const externalFiles = await this.externalFilesRepository
      .readUserAllExternalFiles();
    return externalFiles;
  }
}
