import { IHttpResponse } from '@/adapters/interfaces';
import { ReadAllExternalFilesUseCase } from '@/use-cases/attachment/external-file/read-all-external-files';
import { IController } from '@/adapters/controllers/interfaces';
import { serverError, ok } from '@/adapters/utils/http';

export class ReadAllExternalFilesController implements IController {
  constructor(
    private readonly readAllExternalFiles: ReadAllExternalFilesUseCase,
  ) { }

  async handle(): Promise<IHttpResponse> {
    try {
      const externalFiles = await this.readAllExternalFiles.execute();
      return ok(externalFiles);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
