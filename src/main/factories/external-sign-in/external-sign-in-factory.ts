import { ExternalSignInUseCase } from '@/use-cases/external-sign-in';
import { ExternalSignInController } from '@/adapters/controllers/external-sign-in-controller';
import { IController } from '@/adapters/interfaces';
import { UserRepository } from '@/infra/repositories';
import { UuidAdapter } from '@/infra/uuid-adapter';
import { JwtAdapter } from '@/infra/criptography';
import { makeExternalSignInValidationFactory } from '@/main/factories/external-sign-in';
import env from '@/main/config/env';

export function makeExternalSignInController(): IController {
  const userRepository = new UserRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret, env.expiresIn);
  const uuidAdapter = new UuidAdapter();
  const externalSignInUseCase = new ExternalSignInUseCase(userRepository, uuidAdapter, jwtAdapter);
  const externalSignInController = new ExternalSignInController(
    makeExternalSignInValidationFactory(), externalSignInUseCase,
  );
  return externalSignInController;
}
