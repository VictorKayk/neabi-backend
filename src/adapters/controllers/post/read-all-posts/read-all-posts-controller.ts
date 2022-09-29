import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { ReadAllPostsUseCase } from '@/use-cases/post/read-all-posts';
import { IController } from '@/adapters/controllers/interfaces';
import { serverError, ok } from '@/adapters/utils/http';

export class ReadAllPostsController implements IController {
  constructor(
    private readonly readBySlugPost: ReadAllPostsUseCase,
  ) { }

  async handle({ query }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const posts = await this.readBySlugPost.execute(query);
      return ok(posts);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
