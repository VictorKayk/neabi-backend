import { Either, success, error } from '@/shared';
import { IUseCase, IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IVerificationTokenRepositoryReturnData, IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';

type Response = Either<NonExistingUserError, IVerificationTokenRepositoryReturnData>;

export class AddVerificationTokenUseCase implements IUseCase {
  constructor(
    private readonly verificationTokenRepository: IVerificationTokenRepository,
    private readonly tokenGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute(userId: string, expiresInHours = 1): Promise<Response> {
    const userOrNull = await this.verificationTokenRepository.findUserById(userId);
    if (!userOrNull) return error(new NonExistingUserError());

    const userAlreadyHaveAnVerificationToken = await this.verificationTokenRepository
      .findVerificationTokenByUserId(userId);
    if (userAlreadyHaveAnVerificationToken) {
      await this.verificationTokenRepository.deleteVerificationTokenByUserId(userId);
    }

    const token = await this.tokenGenerator.generate();

    const verificationToken = await this.verificationTokenRepository
      .add({ token, userId, expiresInHours });
    return success(verificationToken);
  }
}
