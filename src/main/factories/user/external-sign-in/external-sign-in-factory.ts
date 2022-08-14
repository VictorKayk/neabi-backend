import { ExternalSignInUseCase } from '@/use-cases/user/external-sign-in';
import { ExternalSignInController } from '@/adapters/controllers/user/external-sign-in';
import { IController } from '@/adapters/controllers/interfaces';
import { UserRepository } from '@/infra/repositories';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { JwtAdapter } from '@/infra/criptography';
import { makeExternalSignInValidationFactory } from '@/main/factories/user';
import env from '@/main/config/env';

export function makeExternalSignInController(): IController {
  const userRepository = new UserRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret, env.expiresIn);
  const uuidAdapter = new UuidAdapter();

  const externalSignInUseCase = new ExternalSignInUseCase(userRepository, uuidAdapter, jwtAdapter);

  const externalSignInController = new ExternalSignInController(
    makeExternalSignInValidationFactory(),
    externalSignInUseCase,
  );
  return externalSignInController;
}
