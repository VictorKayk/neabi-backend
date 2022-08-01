import { IUseCase } from '@/use-cases/interfaces';
import { IRoleRepositoryReturnData, IRoleRepository } from '@/use-cases/role/interfaces';
import { NonExistingRoleError } from '@/use-cases/role/errors';

import { Either, error, success } from '@/shared';

type Response = Either<NonExistingRoleError, IRoleRepositoryReturnData>;

export class DeleteRoleByIdUseCase implements IUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const roleOrNull = await this.roleRepository.findById(id);
    if (!roleOrNull) return error(new NonExistingRoleError());

    const role = await this.roleRepository.deleteById(id);
    return success(role);
  }
}
