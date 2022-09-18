/* eslint-disable camelcase */
import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import { ok, serverError, badRequest } from '@/adapters/utils/http';
import { getUserVisibleData } from '@/adapters/controllers/user/utils';
import { IUserVisibleData } from '@/adapters/controllers/user/interfaces';
import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { ReadRoleByRoleNameUseCase } from '@/use-cases/role/read-role-by-role-name';
import { ReadAllRolesFromUserUseCase } from '@/use-cases/user-has-role/read-all-roles-from-user';

export class ExternalSignInController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly externalSignIn: ExternalSignInUseCase,
    private readonly readAllRolesFromUser: ReadAllRolesFromUserUseCase,
    private readonly createRole: CreateRoleUseCase,
    private readonly addRoleToUser: AddRoleToUserUseCase,
    private readonly readRoleByRoleName: ReadRoleByRoleNameUseCase,
  ) { }

  async handle({ body }: IHttpRequest): Promise<IHttpResponse<IUserVisibleData>> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const { name, email, email_verified } = body;
      const accountOrError = await this.externalSignIn.execute(
        { name, email, isVerified: email_verified },
      );
      if (accountOrError.isError()) return badRequest(accountOrError.value);

      const account = getUserVisibleData(accountOrError.value);

      const rolesFromUser = await this.readAllRolesFromUser
        .execute({ userId: account.id, roleDataQuery: {} });

      if (rolesFromUser.isSuccess() && rolesFromUser.value.length < 1) {
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
      }

      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
