import { DeleteRoleByIdUseCase } from '@/use-cases/role/delete-role-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { RoleRepository } from '@/infra/repositories';
import { DeleteRoleByIdController } from '@/adapters/controllers/role/delete-role-by-id';

export function makeDeleteRoleByIdController(): IController {
  const roleRepository = new RoleRepository();
  const deleteRoleByIdUseCase = new DeleteRoleByIdUseCase(roleRepository);
  const deleteRoleByIdController = new DeleteRoleByIdController(deleteRoleByIdUseCase);
  return deleteRoleByIdController;
}
