import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { CreateUrlUseCase } from '@/use-cases/attachment/url/create-url';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import { created, serverError, badRequest } from '@/adapters/utils/http';

export class CreateUrlController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly createUrl: CreateUrlUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { name, url } = body;

      const urlOrError = await this.createUrl.execute({ name, url });
      if (urlOrError.isError()) return badRequest(urlOrError.value);

      return created(urlOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
