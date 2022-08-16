import { VerifyTokenController } from '@/adapters/controllers/verification-token/verify-token';
import { IController } from '@/adapters/controllers/interfaces';
import { VerificationTokenRepository } from '@/infra/repositories';
import { makeVerifyTokenValidationFactory } from '@/main/factories/verification-token';
import { VerifyTokenUseCase } from '@/use-cases/verification-token/verify-token';

export function makeVerifyTokenController(): IController {
  const verificationTokenRepository = new VerificationTokenRepository();
  const verifyTokenUseCase = new VerifyTokenUseCase(verificationTokenRepository);

  const verifyTokenController = new VerifyTokenController(
    makeVerifyTokenValidationFactory(),
    verifyTokenUseCase,
  );
  return verifyTokenController;
}
