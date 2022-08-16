import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { ExistingRoleError } from '@/use-cases/role/errors';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class CreateRoleController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly createRole: CreateRoleUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { role } = body;

      const roleOrError = await this.createRole.execute(role);
      if (roleOrError.isError()) {
        if (roleOrError.value instanceof ExistingRoleError) return forbidden(roleOrError.value);
        return badRequest(roleOrError.value);
      }

      const roleData = roleOrError.value;
      return created(roleData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
