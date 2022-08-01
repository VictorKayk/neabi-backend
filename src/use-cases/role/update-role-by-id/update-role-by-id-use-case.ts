import { IUseCase } from '@/use-cases/interfaces';
import { IRoleRepositoryReturnData, IRoleData, IRoleRepository } from '@/use-cases/role/interfaces';
import { NonExistingRoleError, ExistingRoleError } from '@/use-cases/role/errors';
import { Role } from '@/entities/value-object';
import { Either, error, success } from '@/shared';

type Response = Either<NonExistingRoleError, IRoleRepositoryReturnData>;

export class UpdateRoleByIdUseCase implements IUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
  ) { }

  async execute({ id, role }: IRoleData): Promise<Response> {
    const roleOrError = Role.create(role);
    if (roleOrError.isError()) return error(roleOrError.value);

    let roleOrNull = await this.roleRepository.findById(id);
    if (!roleOrNull) return error(new NonExistingRoleError());

    roleOrNull = await this.roleRepository.findByRole(role);
    if (roleOrNull && roleOrNull.id !== id) return error(new ExistingRoleError());

    const roleUpdated = await this.roleRepository.updateById({ id, role });
    return success(roleUpdated);
  }
}
