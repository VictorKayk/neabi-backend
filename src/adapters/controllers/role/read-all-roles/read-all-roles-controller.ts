import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { ReadAllRolesUseCase } from '@/use-cases/role/read-all-roles';
import { IController } from '@/adapters/controllers/interfaces';
import { serverError, ok } from '@/adapters/util/http';

export class ReadAllRolesController implements IController {
  constructor(
    private readonly readAllRoles: ReadAllRolesUseCase,
  ) { }

  async handle({ query }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const roles = await this.readAllRoles.execute(query);
      return ok(roles);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
