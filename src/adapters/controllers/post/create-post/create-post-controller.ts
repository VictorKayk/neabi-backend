import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { CreatePostUseCase } from '@/use-cases/post/create-post';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import { created, serverError, badRequest } from '@/adapters/utils/http';

export class CreatePostController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly createPost: CreatePostUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { title, description } = body;

      const postOrError = await this.createPost.execute({ title, description });
      if (postOrError.isError()) return badRequest(postOrError.value);

      const postData = postOrError.value;
      return created(postData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
