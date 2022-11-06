import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { UpdateTagByIdUseCase } from '@/use-cases/tag/update-tag-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';
import { ExistingTagError } from '@/use-cases/tag/errors';

export class UpdateTagByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly updateTagByIdUseCase: UpdateTagByIdUseCase,
  ) { }

  async handle({ params, body }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate({ ...body, ...params });
      if (validationError) return badRequest(validationError);

      const { tag } = body;
      const { id } = params;

      const tagOrError = await this.updateTagByIdUseCase.execute({ id, tag });
      if (tagOrError.isError()) {
        if (
          tagOrError.value instanceof ExistingTagError
        ) return unauthorized(tagOrError.value);
        return badRequest(tagOrError.value);
      }

      return ok(tagOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
