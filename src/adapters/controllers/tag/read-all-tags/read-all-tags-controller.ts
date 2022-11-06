import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { ReadAllTagsUseCase } from '@/use-cases/tag/read-all-tags';
import { IController } from '@/adapters/controllers/interfaces';
import { serverError, ok } from '@/adapters/utils/http';

export class ReadAllTagsController implements IController {
  constructor(
    private readonly readAllTags: ReadAllTagsUseCase,
  ) { }

  async handle({ query }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const tags = await this.readAllTags.execute(query);
      return ok(tags);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
