import { IUseCase } from '@/use-cases/interfaces';
import { IRoleRepositoryReturnData, IRoleRepository } from '@/use-cases/roles/interfaces';
import { NonExistingRoleError } from '@/use-cases/roles/errors';

import { Either, error, success } from '@/shared';

type Response = Either<NonExistingRoleError, IRoleRepositoryReturnData>;

export class ReadRoleByIdUseCase implements IUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const userOrNull = await this.roleRepository.findById(id);
    if (!userOrNull) return error(new NonExistingRoleError());
    return success(userOrNull);
  }
}
