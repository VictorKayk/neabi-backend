import { ReadAllRolesUseCase } from '@/use-cases/role/read-all-roles';
import { IController } from '@/adapters/controllers/interfaces';
import { RoleRepository } from '@/infra/repositories';
import { ReadAllRolesController } from '@/adapters/controllers/role/read-all-roles';

export function makeReadAllRolesController(): IController {
  const roleRepository = new RoleRepository();
  const readAllRolesUseCase = new ReadAllRolesUseCase(roleRepository);
  const readAllRolesController = new ReadAllRolesController(readAllRolesUseCase);
  return readAllRolesController;
}
