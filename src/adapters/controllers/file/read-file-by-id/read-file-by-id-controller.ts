import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadFileByIdUseCase } from '@/use-cases/file/read-file-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';

export class ReadFileByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readByIdFile: ReadFileByIdUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { fileId } = params;

      const fileOrError = await this.readByIdFile.execute(fileId);
      if (fileOrError.isError()) return unauthorized(fileOrError.value);

      return ok(fileOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
