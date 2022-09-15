import { Either, success, error } from '@/shared';
import { ExpiredTokenError, InvalidTokenError, NonExistingTokenError } from '@/use-cases/errors';
import { IHashCompare, IUseCase, ITokenData } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import {UserIsAlreadyVerifiedError
} from '@/use-cases/verification-token/errors';
import { IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';

type Response = Either<
  InvalidTokenError |
  NonExistingUserError |
  UserIsAlreadyVerifiedError |
  NonExistingTokenError |
  ExpiredTokenError,
  IUserRepositoryReturnData
>;

export class VerifyTokenUseCase implements IUseCase {
  constructor(
    private readonly verificationTokenRepository: IVerificationTokenRepository,
    private readonly hashCompare: IHashCompare,
  ) { }

  async execute({ userId, token }: ITokenData): Promise<Response> {
    const userOrNull = await this.verificationTokenRepository.findUserById(userId);
    if (!userOrNull) return error(new NonExistingUserError());
    if (userOrNull.isVerified) return error(new UserIsAlreadyVerifiedError());

    const verificationTokenOrNull = await this.verificationTokenRepository
      .findVerificationTokenByUserId(userId);
    if (!verificationTokenOrNull) return error(new NonExistingTokenError());
    if (verificationTokenOrNull.expiresAt < new Date(Date.now())) {
      return error(new ExpiredTokenError());
    }

    const compareToken = await this.hashCompare.compare(verificationTokenOrNull.token, token);
    if (!compareToken) return error(new InvalidTokenError());

    await this.verificationTokenRepository.deleteVerificationTokenByUserId(userId);

    const user = await this.verificationTokenRepository
      .updateUserVerification(userId, true);
    return success(user);
  }
}
