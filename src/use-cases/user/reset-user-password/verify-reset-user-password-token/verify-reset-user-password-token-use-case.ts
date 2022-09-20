import { Either, success, error } from '@/shared';
import { IHashCompare, IUseCase } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { ITokenData, IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import {
  NonExistingTokenError, ExpiredTokenError, InvalidTokenError,
} from '@/use-cases/errors';
import { IResetUserPasswordTokenRepository } from '@/use-cases/user/reset-user-password/interfaces';

type Response = Either<
  InvalidTokenError |
  NonExistingUserError |
  NonExistingTokenError |
  ExpiredTokenError,
  IUserRepositoryReturnData
>;

export class VerifyResetUserPasswordTokenUseCase implements IUseCase {
  constructor(
    private readonly resetUserPasswordTokenRepository: IResetUserPasswordTokenRepository,
    private readonly hashCompare: IHashCompare,
  ) { }

  async execute({ userId, token }: ITokenData): Promise<Response> {
    const userOrNull = await this.resetUserPasswordTokenRepository.findUserById(userId);
    if (!userOrNull) return error(new NonExistingUserError());

    const resetUserPasswordTokenOrNull = await this.resetUserPasswordTokenRepository
      .findResetUserPasswordTokenByUserId(userId);
    if (!resetUserPasswordTokenOrNull) return error(new NonExistingTokenError());
    if (resetUserPasswordTokenOrNull.expiresAt < new Date(Date.now())) {
      return error(new ExpiredTokenError());
    }

    const compareToken = await this.hashCompare.compare(resetUserPasswordTokenOrNull.token, token);
    if (!compareToken) return error(new InvalidTokenError());

    await this.resetUserPasswordTokenRepository.deleteResetUserPasswordTokenByUserId(userId);

    return success(userOrNull);
  }
}
