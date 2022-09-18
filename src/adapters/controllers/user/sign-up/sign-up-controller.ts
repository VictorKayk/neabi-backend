import { ExistingUserError } from '@/use-cases/user/errors';
import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';
import { SignUpUseCase } from '@/use-cases/user/sign-up';
import { getUserVisibleData } from '@/adapters/controllers/user/utils';
import { IUserVisibleData } from '@/adapters/controllers/user/interfaces';
import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { ReadRoleByRoleNameUseCase } from '@/use-cases/role/read-role-by-role-name';

export class SignUpController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly signUp: SignUpUseCase,
    private readonly createRole: CreateRoleUseCase,
    private readonly addRoleToUser: AddRoleToUserUseCase,
    private readonly readRoleByRoleName: ReadRoleByRoleNameUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse<IUserVisibleData>> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { name, email, password } = body;

      const accountOrError = await this.signUp.execute({ name, email, password });
      if (accountOrError.isError()) {
        if (accountOrError.value instanceof ExistingUserError) {
          return forbidden(accountOrError.value);
        }
        return badRequest(accountOrError.value);
      }

      const account = getUserVisibleData(accountOrError.value);

      // Default user role
      const createUserRoleOrError = await this.createRole.execute('user');
      if (createUserRoleOrError.isSuccess()) {
        await this.addRoleToUser.execute({
          userId: account.id, roleId: createUserRoleOrError.value.id,
        });
      } else {
        const userRoleOrError = await this.readRoleByRoleName.execute('user');
        if (userRoleOrError.isSuccess()) {
          await this.addRoleToUser.execute({
            userId: account.id, roleId: userRoleOrError.value.id,
          });
        }
      }

      return created(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
