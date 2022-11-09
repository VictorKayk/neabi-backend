import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { RemoveTagFromPostUseCase } from '@/use-cases/post-has-tag/remove-tag-from-post';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class RemoveTagFromPostController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly removeTagFromPostUseCase: RemoveTagFromPostUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { postId, tagId } = params;

      const tagOrError = await this.removeTagFromPostUseCase
        .execute({ postId, tagId });
      if (tagOrError.isError()) return forbidden(tagOrError.value);

      const postHasTagData = tagOrError.value;
      return ok(postHasTagData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
