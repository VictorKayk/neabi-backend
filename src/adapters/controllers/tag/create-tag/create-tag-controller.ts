import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { CreateTagUseCase } from '@/use-cases/tag/create-tag';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class CreateTagController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly createTagUseCase: CreateTagUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { tag } = body;

      const tagOrError = await this.createTagUseCase.execute(tag);
      if (tagOrError.isError()) return forbidden(tagOrError.value);

      const tagData = tagOrError.value;
      return created(tagData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
