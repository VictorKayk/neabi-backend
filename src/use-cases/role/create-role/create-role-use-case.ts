import { IUseCase, IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { IRoleRepositoryReturnData, IRoleRepository } from '@/use-cases/role/interfaces';
import { ExistingRoleError } from '@/use-cases/role/errors';
import { Role } from '@/entities/value-object';
import { InvalidRoleError } from '@/entities/value-object/errors';

import { Either, error, success } from '@/shared';

type Response = Either<InvalidRoleError | ExistingRoleError, IRoleRepositoryReturnData>;

export class CreateRoleUseCase implements IUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute(role: string): Promise<Response> {
    const newRole = role.toLocaleLowerCase();
    const roleOrError = Role.create(newRole);
    if (roleOrError.isError()) return error(roleOrError.value);

    let roleOrNull = await this.roleRepository.findByRole(newRole);
    if (roleOrNull) {
      if (!roleOrNull.isDeleted) return error(new ExistingRoleError());

      const roleData = await this.roleRepository.updateById(roleOrNull.id, { isDeleted: false });
      return success(roleData);
    }

    let id: string;
    do {
      id = await this.idGenerator.generate();
      roleOrNull = await this.roleRepository.findById(id);
    } while (roleOrNull);

    const roleData = await this.roleRepository.add({ id, role: newRole });

    return success(roleData);
  }
}
