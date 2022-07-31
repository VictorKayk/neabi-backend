import { ReadRoleUseCase } from '@/use-cases/roles/read-role';
import { ReadRoleController } from '@/adapters/controllers/roles/read-role';
import { IController } from '@/adapters/controllers/interfaces';
import { RoleRepository } from '@/infra/repositories';

export function makeReadRoleController(): IController {
  const roleRepository = new RoleRepository();
  const readRoleUseCase = new ReadRoleUseCase(roleRepository);
  const readRoleController = new ReadRoleController(readRoleUseCase);
  return readRoleController;
}
