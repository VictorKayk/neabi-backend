import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { ReadAllFilesUseCase } from '@/use-cases/file/read-all-files';
import { IController } from '@/adapters/controllers/interfaces';
import { serverError, ok } from '@/adapters/utils/http';

export class ReadAllFilesController implements IController {
  constructor(
    private readonly readAllFiles: ReadAllFilesUseCase,
  ) { }

  async handle({ query }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const files = await this.readAllFiles.execute(query);
      return ok(files);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
