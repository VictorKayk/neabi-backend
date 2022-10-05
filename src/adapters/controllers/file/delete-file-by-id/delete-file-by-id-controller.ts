import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  unauthorized,
} from '@/adapters/utils/http';
import { DeleteFileByIdUseCase } from '@/use-cases/file/delete-file-by-id';
import { DeleteFileService } from '@/use-cases/services/file-service/delete-file';

export class DeleteFileByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly deleteFileById: DeleteFileByIdUseCase,
    private readonly deleteFileService: DeleteFileService,
  ) { }

  async handle({ params }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { fileId } = params;

      const fileOrError = await this.deleteFileById.execute(fileId);
      if (fileOrError.isError()) return unauthorized(fileOrError.value);

      const fileServiceOrError = await this.deleteFileService.execute(fileOrError.value.fileName);
      if (fileServiceOrError.isError()) return badRequest(fileServiceOrError.value);

      return ok(fileOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
