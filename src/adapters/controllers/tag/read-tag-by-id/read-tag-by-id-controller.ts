import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadTagByIdUseCase } from '@/use-cases/tag/read-tag-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';

export class ReadTagByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readByIdTagUseCase: ReadTagByIdUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { tagId } = params;

      const tagOrError = await this.readByIdTagUseCase.execute(tagId);
      if (tagOrError.isError()) return unauthorized(tagOrError.value);

      return ok(tagOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
