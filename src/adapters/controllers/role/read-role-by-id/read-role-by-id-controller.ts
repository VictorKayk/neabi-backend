import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadRoleByIdUseCase } from '@/use-cases/role/read-role-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';

export class ReadRoleByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readByIdRole: ReadRoleByIdUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { id } = params;

      const roleOrError = await this.readByIdRole.execute(id);
      if (roleOrError.isError()) return unauthorized(roleOrError.value);

      return ok(roleOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
