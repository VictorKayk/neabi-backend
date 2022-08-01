import { UpdateRoleByIdUseCase } from '@/use-cases/role/update-role-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { RoleRepository } from '@/infra/repositories';
import { makeUpdateRoleByIdValidationFactory } from '@/main/factories/role';
import { UpdateRoleByIdController } from '@/adapters/controllers/role/update-role-by-id';

export function makeUpdateRoleByIdController(): IController {
  const roleRepository = new RoleRepository();
  const updateRoleByIdUseCase = new UpdateRoleByIdUseCase(roleRepository);
  const updateRoleByIdController = new UpdateRoleByIdController(
    makeUpdateRoleByIdValidationFactory(), updateRoleByIdUseCase,
  );
  return updateRoleByIdController;
}
