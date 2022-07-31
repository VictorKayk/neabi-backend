import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadRoleUseCase } from '@/use-cases/roles/read-role';
import { IController } from '@/adapters/controllers/interfaces';
import { serverError, unauthorized, ok } from '@/adapters/util/http';

export class ReadRoleController implements IController {
  constructor(
    private readonly readRole: ReadRoleUseCase,
  ) { }

  async handle({ id }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const roleOrError = await this.readRole.execute(id);
      if (roleOrError.isError()) return unauthorized(roleOrError.value);

      return ok(roleOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
