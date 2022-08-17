import { Either, success, error } from '@/shared';
import { IUseCase, IUniversallyUniqueIdentifierGenerator, IHasher } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IVerificationTokenRepositoryReturnData, IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';

type Response = Either<
  NonExistingUserError, { verificationToken: IVerificationTokenRepositoryReturnData, token: string }
>;

export class AddVerificationTokenUseCase implements IUseCase {
  constructor(
    private readonly verificationTokenRepository: IVerificationTokenRepository,
    private readonly tokenGenerator: IUniversallyUniqueIdentifierGenerator,
    private readonly hasher: IHasher,
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
    const hashedToken = await this.hasher.hash(token);

    const verificationToken = await this.verificationTokenRepository
      .add({ token: hashedToken, userId, expiresInHours });

    return success({ verificationToken, token });
  }
}
