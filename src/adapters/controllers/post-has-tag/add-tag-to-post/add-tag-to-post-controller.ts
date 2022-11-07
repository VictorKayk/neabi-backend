import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { AddTagToPostUseCase } from '@/use-cases/post-has-tag/add-tag-to-post';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class AddTagToPostController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addTagToPostUseCase: AddTagToPostUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { postId, tagId } = params;

      const postHasTagOrError = await this.addTagToPostUseCase
        .execute({ postId, tagId });
      if (postHasTagOrError.isError()) return forbidden(postHasTagOrError.value);

      const postHasTagData = postHasTagOrError.value;
      return created(postHasTagData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
