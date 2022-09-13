import { Either, success, error } from '@/shared';
import {
  IUseCase, IUniversallyUniqueIdentifierGenerator, IHasher, ITokenRepositoryReturnData,
} from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IResetUserPasswordTokenRepository } from '@/use-cases/user/reset-user-password/interfaces';

type Response = Either<
  NonExistingUserError, { resetUserPasswordToken: ITokenRepositoryReturnData, token: string }
>;

export class AddResetUserPasswordTokenUseCase implements IUseCase {
  constructor(
    private readonly resetUserPasswordTokenRepository: IResetUserPasswordTokenRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
    private readonly tokenGenerator: IUniversallyUniqueIdentifierGenerator,
    private readonly hasher: IHasher,
  ) { }

  async execute(userId: string, expiresInHours = 1): Promise<Response> {
    const userOrNull = await this.resetUserPasswordTokenRepository.findUserById(userId);
    if (!userOrNull) return error(new NonExistingUserError());

    const userAlreadyHaveAnResetUserPasswordToken = await this.resetUserPasswordTokenRepository
      .findResetUserPasswordTokenByUserId(userId);
    if (userAlreadyHaveAnResetUserPasswordToken) {
      await this.resetUserPasswordTokenRepository.deleteResetUserPasswordTokenByUserId(userId);
    }

    const resetUserPasswordTokenId = await this.idGenerator.generate();
    const token = await this.tokenGenerator.generate();
    const hashedToken = await this.hasher.hash(token);

    const resetUserPasswordToken = await this.resetUserPasswordTokenRepository
      .add({
        resetUserPasswordTokenId, token: hashedToken, userId, expiresInHours,
      });

    return success({ resetUserPasswordToken, token });
  }
}
