import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';

export class AddRoleToUserController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addRoleToUser: AddRoleToUserUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { userId, roleId } = params;

      const roleOrError = await this.addRoleToUser.execute({ userId, roleId });
      if (roleOrError.isError()) return forbidden(roleOrError.value);

      const roleData = roleOrError.value;
      return created(roleData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
