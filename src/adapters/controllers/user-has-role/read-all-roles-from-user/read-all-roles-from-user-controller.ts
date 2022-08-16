import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadAllRolesFromUserUseCase } from '@/use-cases/user-has-role/read-all-roles-from-user';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class ReadAllRolesFromUserController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readAllRolesFromUser: ReadAllRolesFromUserUseCase,
  ) { }

  async handle({ params, query }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { userId } = params;

      const roleOrError = await this.readAllRolesFromUser.execute({ userId, roleDataQuery: query });
      if (roleOrError.isError()) return forbidden(roleOrError.value);

      const roleData = roleOrError.value;
      return ok(roleData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
