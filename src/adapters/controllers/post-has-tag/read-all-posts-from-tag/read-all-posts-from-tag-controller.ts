import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadAllPostsFromTagUseCase } from '@/use-cases/post-has-tag/read-all-posts-from-tag';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class ReadAllPostsFromTagController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readAllPostsFromTag: ReadAllPostsFromTagUseCase,
  ) { }

  async handle({ params, query }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { tagId } = params;

      const postsOrError = await this.readAllPostsFromTag
        .execute({ tagId, postDataQuery: query });
      if (postsOrError.isError()) return forbidden(postsOrError.value);

      const postsData = postsOrError.value;
      return ok(postsData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
