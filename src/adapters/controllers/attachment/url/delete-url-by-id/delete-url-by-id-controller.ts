import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  unauthorized,
} from '@/adapters/utils/http';
import { DeleteUrlByIdUseCase } from '@/use-cases/attachment/url/delete-url-by-id';

export class DeleteUrlByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly deleteUrlById: DeleteUrlByIdUseCase,
  ) { }

  async handle({ params }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { urlId } = params;

      const urlOrError = await this.deleteUrlById.execute(urlId);
      if (urlOrError.isError()) return unauthorized(urlOrError.value);

      return ok(urlOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
