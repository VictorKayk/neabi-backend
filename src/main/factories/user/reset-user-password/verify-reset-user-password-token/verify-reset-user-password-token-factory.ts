import { VerifyResetUserPasswordTokenController } from '@/adapters/controllers/user/reset-user-password/verify-reset-user-password-token';
import { IController } from '@/adapters/controllers/interfaces';
import { ResetUserPasswordTokenRepository, UserRepository } from '@/infra/repositories';
import { makeVerifyResetUserPasswordTokenValidationFactory } from '@/main/factories/user/reset-user-password/verify-reset-user-password-token';
import { VerifyResetUserPasswordTokenUseCase } from '@/use-cases/user/reset-user-password/verify-reset-user-password-token';
import { BcryptAdapter } from '@/infra/criptography';
import env from '@/main/config/env';
import { UpdateUserUseCase } from '@/use-cases/user/update-user';

export function makeVerifyResetUserPasswordTokenController(): IController {
  const resetUserPasswordTokenRepository = new ResetUserPasswordTokenRepository();
  const salt = env.bcryptSalt;
  const bcryptAdapter = new BcryptAdapter(salt);
  const verifyResetUserPasswordTokenUseCase = new VerifyResetUserPasswordTokenUseCase(
    resetUserPasswordTokenRepository, bcryptAdapter,
  );
  const userRepository = new UserRepository();
  const updateUserUseCase = new UpdateUserUseCase(userRepository, bcryptAdapter);

  const verifyResetUserPasswordTokenController = new VerifyResetUserPasswordTokenController(
    makeVerifyResetUserPasswordTokenValidationFactory(),
    verifyResetUserPasswordTokenUseCase,
    updateUserUseCase,
  );
  return verifyResetUserPasswordTokenController;
}
