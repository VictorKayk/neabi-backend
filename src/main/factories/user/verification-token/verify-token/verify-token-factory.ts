import { VerifyTokenController } from '@/adapters/controllers/user/verification-token/verify-token';
import { IController } from '@/adapters/controllers/interfaces';
import { VerificationTokenRepository } from '@/infra/repositories';
import { makeVerifyTokenValidationFactory } from '@/main/factories/user/verification-token';
import { VerifyTokenUseCase } from '@/use-cases/user/verification-token/verify-token';
import { BcryptAdapter } from '@/infra/criptography';
import env from '@/main/config/env';

export function makeVerifyTokenController(): IController {
  const verificationTokenRepository = new VerificationTokenRepository();
  const salt = env.bcryptSalt;
  const bcryptAdapter = new BcryptAdapter(salt);
  const verifyTokenUseCase = new VerifyTokenUseCase(verificationTokenRepository, bcryptAdapter);

  const verifyTokenController = new VerifyTokenController(
    makeVerifyTokenValidationFactory(),
    verifyTokenUseCase,
  );
  return verifyTokenController;
}
