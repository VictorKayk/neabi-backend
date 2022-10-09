import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadUrlByIdUseCase } from '@/use-cases/attachment/url/read-url-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';

export class ReadUrlByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readUrlById: ReadUrlByIdUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { urlId } = params;

      const urlOrError = await this.readUrlById.execute(urlId);
      if (urlOrError.isError()) return unauthorized(urlOrError.value);

      return ok(urlOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
