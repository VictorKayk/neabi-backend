import { IUseCase } from '@/use-cases/interfaces';
import { IFileRepositoryReturnData, IFileRepository, IFileDataQuery } from '@/use-cases/file/interfaces';

type Response = IFileRepositoryReturnData[] | [];

export class ReadAllFilesUseCase implements IUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
  ) { }

  async execute(fileDataQuery: IFileDataQuery): Promise<Response> {
    const files = await this.fileRepository.readAllFiles(fileDataQuery);
    return files;
  }
}
