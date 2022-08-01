import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { DeleteRoleByIdUseCase } from '@/use-cases/role/delete-role-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { serverError, unauthorized, ok } from '@/adapters/util/http';

export class DeleteRoleByIdController implements IController {
  constructor(
    private readonly deleteRoleById: DeleteRoleByIdUseCase,
  ) { }

  async handle({ params: { id } }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const roleOrError = await this.deleteRoleById.execute(id);
      if (roleOrError.isError()) return unauthorized(roleOrError.value);

      return ok(roleOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
