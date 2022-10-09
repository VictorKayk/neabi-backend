import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { UpdateUrlByIdUseCase } from '@/use-cases/attachment/url/update-url-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import { serverError, ok, badRequest } from '@/adapters/utils/http';

export class UpdateUrlByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly updateUrlById: UpdateUrlByIdUseCase,
  ) { }

  async handle({ params, body }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate({ ...body, ...params });
      if (validationError) return badRequest(validationError);

      const { id } = params;
      const { name, url } = body;

      const urlOrError = await this.updateUrlById.execute({ id, urlData: { name, url } });
      if (urlOrError.isError()) return badRequest(urlOrError.value);

      return ok(urlOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
