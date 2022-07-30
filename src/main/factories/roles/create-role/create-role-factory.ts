import { CreateRoleUseCase } from '@/use-cases/roles/create-role';
import { CreateRoleController } from '@/adapters/controllers/roles/create-role';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { RoleRepository } from '@/infra/repositories';
import { makeCreateRoleValidationFactory } from '@/main/factories/roles';

export function makeCreateRoleController(): IController {
  const roleRepository = new RoleRepository();
  const uuidAdapter = new UuidAdapter();
  const createRoleUseCase = new CreateRoleUseCase(roleRepository, uuidAdapter);
  const createRoleController = new CreateRoleController(
    makeCreateRoleValidationFactory(), createRoleUseCase,
  );
  return createRoleController;
}
