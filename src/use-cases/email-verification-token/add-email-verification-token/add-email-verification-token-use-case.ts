import { Either, success, error } from '@/shared';
import { IUseCase, IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IEmailValidationTokenRepositoryReturnData, IEmailVerificationTokenRepository } from '../interfaces';

type Response = Either<NonExistingUserError, IEmailValidationTokenRepositoryReturnData>;

export class AddEmailVerificationTokenUseCase implements IUseCase {
  constructor(
    private readonly emailVerificationTokenRepository: IEmailVerificationTokenRepository,
    private readonly tokenGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute(userId: string, expiresInHours = 1): Promise<Response> {
    const userOrNull = await this.emailVerificationTokenRepository.findUserById(userId);
    if (!userOrNull) return error(new NonExistingUserError());

    const userAlreadyHaveAnEmailVerificationToken = await this.emailVerificationTokenRepository
      .findEmailValidationTokenByUserId(userId);
    if (userAlreadyHaveAnEmailVerificationToken) {
      await this.emailVerificationTokenRepository.deleteEmailValidationTokenByUserId(userId);
    }

    const token = await this.tokenGenerator.generate();

    const emailVerificationToken = await this.emailVerificationTokenRepository
      .add({ token, userId, expiresInHours });
    return success(emailVerificationToken);
  }
}
