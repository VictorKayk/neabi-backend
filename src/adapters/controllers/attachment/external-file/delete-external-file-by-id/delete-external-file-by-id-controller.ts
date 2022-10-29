import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  unauthorized,
} from '@/adapters/utils/http';
import { DeleteExternalFileByIdUseCase } from '@/use-cases/attachment/external-file/delete-external-file-by-id';

export class DeleteExternalFileByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly deleteExternalFileById: DeleteExternalFileByIdUseCase,
  ) { }

  async handle({ params }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { fileId } = params;

      const externalFileOrError = await this.deleteExternalFileById.execute(fileId);
      if (externalFileOrError.isError()) return unauthorized(externalFileOrError.value);

      return ok(externalFileOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
