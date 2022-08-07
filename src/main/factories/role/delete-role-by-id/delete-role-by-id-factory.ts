import { DeleteRoleByIdUseCase } from '@/use-cases/role/delete-role-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { RoleRepository } from '@/infra/repositories';
import { DeleteRoleByIdController } from '@/adapters/controllers/role/delete-role-by-id';
import { makeDeleteRoleByIdValidationFactory } from '@/main/factories/role';

export function makeDeleteRoleByIdController(): IController {
  const roleRepository = new RoleRepository();
  const deleteRoleByIdUseCase = new DeleteRoleByIdUseCase(roleRepository);
  const deleteRoleByIdController = new DeleteRoleByIdController(
    makeDeleteRoleByIdValidationFactory(), deleteRoleByIdUseCase,
  );
  return deleteRoleByIdController;
}
