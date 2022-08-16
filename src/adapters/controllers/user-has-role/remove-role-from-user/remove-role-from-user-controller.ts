import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { RemoveRoleFromUserUseCase } from '@/use-cases/user-has-role/remove-role-from-user';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class RemoveRoleFromUserController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly removeRoleFromUser: RemoveRoleFromUserUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { userId, roleId } = params;

      const roleOrError = await this.removeRoleFromUser.execute({ userId, roleId });
      if (roleOrError.isError()) return forbidden(roleOrError.value);

      const roleData = roleOrError.value;
      return ok(roleData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
