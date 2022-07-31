import { ReadRoleByIdUseCase } from '@/use-cases/roles/read-role-by-id';
import { ReadRoleByIdController } from '@/adapters/controllers/roles/read-role-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { RoleRepository } from '@/infra/repositories';

export function makeReadRoleByIdController(): IController {
  const roleRepository = new RoleRepository();
  const readRoleByIdUseCase = new ReadRoleByIdUseCase(roleRepository);
  const readRoleByIdController = new ReadRoleByIdController(readRoleByIdUseCase);
  return readRoleByIdController;
}
