import { SignUpUseCase } from '@/use-cases/user/sign-up';
import { SignUpController } from '@/adapters/controllers/user/sign-up';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { RoleRepository, UserHasRoleRepository, UserRepository } from '@/infra/repositories';
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography';
import { makeSignUpValidationFactory } from '@/main/factories/user';
import env from '@/main/config/env';
import { CreateRoleUseCase } from '@/use-cases/role/create-role';
import { AddRoleToUserUseCase } from '@/use-cases/user-has-role/add-role-to-user';
import { ReadRoleByRoleNameUseCase } from '@/use-cases/role/read-role-by-role-name';

export function makeSignUpController(): IController {
  const salt = env.bcryptSalt;
  const userRepository = new UserRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const uuidAdapter = new UuidAdapter();
  const jwtAdapter = new JwtAdapter(env.jwtSecret, env.expiresIn);

  const signUpUseCase = new SignUpUseCase(userRepository, bcryptAdapter, uuidAdapter, jwtAdapter);
  const roleRepository = new RoleRepository();
  const createRoleUseCase = new CreateRoleUseCase(roleRepository, uuidAdapter);
  const userHasRoleRepository = new UserHasRoleRepository();
  const addRoleToUser = new AddRoleToUserUseCase(userHasRoleRepository);
  const readRoleByRoleName = new ReadRoleByRoleNameUseCase(roleRepository);

  const signUpController = new SignUpController(
    makeSignUpValidationFactory(),
    signUpUseCase,
    createRoleUseCase,
    addRoleToUser,
    readRoleByRoleName,
  );
  return signUpController;
}
