import { IUserRepository, IDecrypter } from '@/use-cases/user/interfaces';
import { IUseCase } from '@/use-cases/interfaces';
import { UnauthorizedError } from '@/use-cases/errors';
import { Either, error, success } from '@/shared';

interface AuthenticationResponse {
  accessToken: string,
  id: string,
}

type Response = Either<UnauthorizedError, AuthenticationResponse>;

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
