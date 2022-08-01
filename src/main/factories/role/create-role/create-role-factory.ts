import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { RoleRepository } from '@/infra/repositories';
import { makeCreateRoleValidationFactory } from '@/main/factories/role';
import { CreateRoleController } from '@/adapters/controllers/role/create-role';

export function makeCreateRoleController(): IController {
  const roleRepository = new RoleRepository();
  const uuidAdapter = new UuidAdapter();
  const createRoleUseCase = new CreateRoleUseCase(roleRepository, uuidAdapter);
  const createRoleController = new CreateRoleController(
    makeCreateRoleValidationFactory(), createRoleUseCase,
  );
  return createRoleController;
}
