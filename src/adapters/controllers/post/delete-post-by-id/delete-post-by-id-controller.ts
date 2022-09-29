import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { DeletePostByIdUseCase } from '@/use-cases/post/delete-post-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';

export class DeletePostByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly deletePostById: DeletePostByIdUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { postId } = params;

      const postOrError = await this.deletePostById.execute(postId);
      if (postOrError.isError()) return unauthorized(postOrError.value);

      return ok(postOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
