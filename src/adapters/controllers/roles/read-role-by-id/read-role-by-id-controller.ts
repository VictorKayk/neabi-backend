import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadRoleByIdUseCase } from '@/use-cases/roles/read-role-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { serverError, unauthorized, ok } from '@/adapters/util/http';

export class ReadRoleByIdController implements IController {
  constructor(
    private readonly readByIdRole: ReadRoleByIdUseCase,
  ) { }

  async handle({ id }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const roleOrError = await this.readByIdRole.execute(id);
      if (roleOrError.isError()) return unauthorized(roleOrError.value);

      return ok(roleOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
