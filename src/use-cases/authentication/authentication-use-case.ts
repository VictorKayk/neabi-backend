import { IUseCase, IUserRepository, IDecrypter } from '@/use-cases/user/interfaces';
import { IAuthenticationResponse } from '@/use-cases/authentication/interfaces';
import { UnauthorizedError } from '@/use-cases/errors';
import { Either, error, success } from '@/shared';

type Response = Either<UnauthorizedError, IAuthenticationResponse>;

export class AuthenticationUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly decrypter: IDecrypter,
  ) { }

  async execute(accessToken: string): Promise<Response> {
    const payloadOrError = await this.decrypter.decrypt(accessToken);
    if (payloadOrError.isError()) return error(new UnauthorizedError());

    const payload = payloadOrError.value;

    const userOrNull = await this.userRepository.findById(payload.id);
    if (!userOrNull) return error(new UnauthorizedError());

    const user = userOrNull;

    if (accessToken !== user.accessToken) return error(new UnauthorizedError());

    return success({
      accessToken,
      id: user.id,
    });
  }
}
