import { ReadRoleByIdUseCase } from '@/use-cases/role/read-role-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { RoleRepository } from '@/infra/repositories';
import { ReadRoleByIdController } from '@/adapters/controllers/role/read-role-by-id';

export function makeReadRoleByIdController(): IController {
  const roleRepository = new RoleRepository();
  const readRoleByIdUseCase = new ReadRoleByIdUseCase(roleRepository);
  const readRoleByIdController = new ReadRoleByIdController(readRoleByIdUseCase);
  return readRoleByIdController;
}
