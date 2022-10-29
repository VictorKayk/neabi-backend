import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadExternalFileByIdUseCase } from '@/use-cases/attachment/external-file/read-external-file-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';

export class ReadExternalFileByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readExternalFileById: ReadExternalFileByIdUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { fileId } = params;

      const externalFileOrError = await this.readExternalFileById.execute(fileId);
      if (externalFileOrError.isError()) return unauthorized(externalFileOrError.value);

      return ok(externalFileOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
