import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadPostBySlugUseCase } from '@/use-cases/post/read-post-by-slug';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';

export class ReadPostBySlugController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readBySlugPost: ReadPostBySlugUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { slug } = params;

      const postOrError = await this.readBySlugPost.execute(slug);
      if (postOrError.isError()) return unauthorized(postOrError.value);

      return ok(postOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
