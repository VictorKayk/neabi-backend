import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { UpdateRoleByIdUseCase } from '@/use-cases/role/update-role-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/utils/http';
import { ExistingRoleError } from '@/use-cases/role/errors';

export class UpdateRoleByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly updateRoleById: UpdateRoleByIdUseCase,
  ) { }

  async handle({ params, body }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate({ ...body, ...params });
      if (validationError) return badRequest(validationError);

      const { role } = body;
      const { id } = params;

      const roleOrError = await this.updateRoleById.execute({ id, role });
      if (roleOrError.isError()) {
        if (
          roleOrError.value instanceof ExistingRoleError
        ) return unauthorized(roleOrError.value);
        return badRequest(roleOrError.value);
      }

      return ok(roleOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
