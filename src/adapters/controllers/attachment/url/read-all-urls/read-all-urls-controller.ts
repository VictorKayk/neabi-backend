import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { ReadAllUrlsUseCase } from '@/use-cases/attachment/url/read-all-urls';
import { IController } from '@/adapters/controllers/interfaces';
import { serverError, ok } from '@/adapters/utils/http';

export class ReadAllUrlsController implements IController {
  constructor(
    private readonly readAllUrls: ReadAllUrlsUseCase,
  ) { }

  async handle({ query }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const urls = await this.readAllUrls.execute(query);
      return ok(urls);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
