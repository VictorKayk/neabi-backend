import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { UpdatePostByIdUseCase } from '@/use-cases/post/update-post-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok, serverError, badRequest, forbidden,
} from '@/adapters/utils/http';
import { NonExistingPostError } from '@/use-cases/post/errors';

export class UpdatePostByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly updatePostById: UpdatePostByIdUseCase,
  ) { }

  async handle({ params, body }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { postId } = params;
      const { title, description } = body;

      const postOrError = await this.updatePostById
        .execute({ id: postId, postData: { title, description } });

      if (postOrError.isError()) {
        if (postOrError.value instanceof NonExistingPostError) {
          return forbidden(postOrError.value);
        }
        return badRequest(postOrError.value);
      }

      const postData = postOrError.value;
      return ok(postData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
