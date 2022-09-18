import { IUseCase } from '@/use-cases/interfaces';
import { IRoleRepositoryReturnData, IRoleRepository } from '@/use-cases/role/interfaces';
import { NonExistingRoleError } from '@/use-cases/role/errors';

import { Either, error, success } from '@/shared';

type Response = Either<NonExistingRoleError, IRoleRepositoryReturnData>;

export class ReadRoleByRoleNameUseCase implements IUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
  ) { }

  async execute(role: string): Promise<Response> {
    const roleOrNull = await this.roleRepository.findByRole(role);
    if (!roleOrNull) return error(new NonExistingRoleError());
    return success(roleOrNull);
  }
}
