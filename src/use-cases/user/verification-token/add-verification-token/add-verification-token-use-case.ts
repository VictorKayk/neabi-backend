import { Either, success, error } from '@/shared';
import {
  IUseCase, IUniversallyUniqueIdentifierGenerator, IHasher,
} from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IVerificationTokenRepository } from '@/use-cases/user/verification-token/interfaces';
import { ITokenRepositoryReturnData } from '@/use-cases/user/interfaces';

type Response = Either<
  NonExistingUserError, { verificationToken: ITokenRepositoryReturnData, token: string }
>;

export class AddVerificationTokenUseCase implements IUseCase {
  constructor(
    private readonly verificationTokenRepository: IVerificationTokenRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
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

    const verificationTokenId = await this.idGenerator.generate();
    const token = await this.tokenGenerator.generate();
    const hashedToken = await this.hasher.hash(token);

    const verificationToken = await this.verificationTokenRepository
      .add({
        verificationTokenId, token: hashedToken, userId, expiresInHours,
      });

    return success({ verificationToken, token });
  }
}
