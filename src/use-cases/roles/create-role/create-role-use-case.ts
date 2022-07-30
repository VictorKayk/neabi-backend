import { IUseCase, IIdGenerator } from '@/use-cases/interfaces';
import { IRoleRepositoryReturnData, IRoleRepository } from '@/use-cases/roles/interfaces';
import { ExistingRoleError } from '@/use-cases/roles/errors';
import { Role } from '@/entities/value-object';
import { InvalidRoleError } from '@/entities/value-object/errors';

import { Either, error, success } from '@/shared';

type Response = Either<InvalidRoleError, IRoleRepositoryReturnData>;

export class CreateRoleUseCase implements IUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly idGenerator: IIdGenerator,
  ) { }

  async execute(role: string): Promise<Response> {
    const roleOrError = Role.create(role);
    if (roleOrError.isError()) return error(roleOrError.value);

    let userOrNull = await this.roleRepository.findByRole(role);
    if (userOrNull) return error(new ExistingRoleError());

    let id: string;
    do {
      id = await this.idGenerator.generate();
      userOrNull = await this.roleRepository.findById(id);
    } while (userOrNull);

    const roleData = await this.roleRepository.add({ id, role });

    return success(roleData);
  }
}
