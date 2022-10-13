import { IUseCase } from '@/use-cases/interfaces';
import { IReadExternalFileData, IExternalFileRepository } from '@/use-cases/attachment/external-file/interfaces';

type Response = IReadExternalFileData[] | [];

export class ReadAllExternalFilesUseCase implements IUseCase {
  constructor(
    private readonly externalFilesRepository: IExternalFileRepository,
  ) { }

  async execute(): Promise<Response> {
    const externalFiles = await this.externalFilesRepository
      .readAllExternalFiles();
    return externalFiles;
  }
}
