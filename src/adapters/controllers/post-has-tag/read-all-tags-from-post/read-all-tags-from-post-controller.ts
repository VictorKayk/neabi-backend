import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadAllTagsFromPostUseCase } from '@/use-cases/post-has-tag/read-all-tags-from-post';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class ReadAllTagsFromPostController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readAllTagsFromPost: ReadAllTagsFromPostUseCase,
  ) { }

  async handle({ params, query }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { postId } = params;

      const tagOrError = await this.readAllTagsFromPost
        .execute({ postId, tagDataQuery: query });
      if (tagOrError.isError()) return forbidden(tagOrError.value);

      const tagsData = tagOrError.value;
      return ok(tagsData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
