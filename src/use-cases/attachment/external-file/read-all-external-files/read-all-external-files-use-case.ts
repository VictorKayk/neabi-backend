import { IUseCase } from '@/use-cases/interfaces';
import { IExternalFileRepositoryReturnData, IExternalFileRepository, IExternalFileDataQuery } from '@/use-cases/attachment/external-file/interfaces';

type Response = IExternalFileRepositoryReturnData[] | [];

export class ReadAllExternalFilesUseCase implements IUseCase {
  constructor(
    private readonly externalFileRepository: IExternalFileRepository,
  ) { }

  async execute(externalFileDataQuery: IExternalFileDataQuery): Promise<Response> {
    const externalFiles = await this.externalFileRepository
      .readAllExternalFiles(externalFileDataQuery);
    return externalFiles;
  }
}
