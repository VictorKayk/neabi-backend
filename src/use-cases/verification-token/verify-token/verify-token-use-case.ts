import { Either, success, error } from '@/shared';
import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import { UserIsAlreadyVerifiedError, NonExistingTokenError, ExpiredTokenError } from '@/use-cases/verification-token/errors';
import { IVerificationTokenData, IVerificationTokenRepository } from '@/use-cases/verification-token/interfaces';

type Response = Either<
  NonExistingUserError | UserIsAlreadyVerifiedError | NonExistingTokenError | ExpiredTokenError,
  IUserRepositoryReturnData
>;

export class VerifyTokenUseCase implements IUseCase {
  constructor(
    private readonly verificationTokenRepository: IVerificationTokenRepository,
  ) { }

  async execute({ userId, token }: IVerificationTokenData): Promise<Response> {
    const userOrNull = await this.verificationTokenRepository.findUserById(userId);
    if (!userOrNull) return error(new NonExistingUserError());
    if (userOrNull.isVerified) return error(new UserIsAlreadyVerifiedError());

    const verificationTokenOrNull = await this.verificationTokenRepository
      .findVerificationToken({ userId, token });
    if (!verificationTokenOrNull) return error(new NonExistingTokenError());
    if (verificationTokenOrNull.expiresAt < new Date(Date.now())) {
      return error(new ExpiredTokenError());
    }

    await this.verificationTokenRepository.deleteVerificationTokenByUserId(userId);

    const user = await this.verificationTokenRepository
      .updateUserVerification(userId, true);
    return success(user);
  }
}
