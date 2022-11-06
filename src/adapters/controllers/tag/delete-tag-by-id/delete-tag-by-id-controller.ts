import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { DeleteTagByIdUseCase } from '@/use-cases/tag/delete-tag-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';

export class DeleteTagByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly deleteTagById: DeleteTagByIdUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { id } = params;

      const tagOrError = await this.deleteTagById.execute(id);
      if (tagOrError.isError()) return unauthorized(tagOrError.value);

      return ok(tagOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
