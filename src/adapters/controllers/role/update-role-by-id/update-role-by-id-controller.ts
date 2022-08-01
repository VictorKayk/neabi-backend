import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { UpdateRoleByIdUseCase } from '@/use-cases/role/update-role-by-id';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  serverError,
  unauthorized,
  ok,
  badRequest,
} from '@/adapters/util/http';
import { NonExistingRoleError } from '@/use-cases/role/errors';

export class UpdateRoleByIdController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly updateRoleById: UpdateRoleByIdUseCase,
  ) { }

  async handle({ params: { id }, body }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { role } = body;

      const roleOrError = await this.updateRoleById.execute({ id, role });
      if (roleOrError.isError()) {
        if (
          roleOrError.value instanceof NonExistingRoleError
        ) return unauthorized(roleOrError.value);
        return badRequest(roleOrError.value);
      }

      return ok(roleOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
