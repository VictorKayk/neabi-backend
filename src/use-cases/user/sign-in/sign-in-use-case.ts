import { User } from '@/entities/user';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/value-object/errors';
import {
  IHashCompare,
  IUserRepository,
  IEncrypter,
  IUserRepositoryReturnData,
} from '@/use-cases/user/interfaces';
import { IUseCase } from '@/use-cases/interfaces';
import { IUserSignIn } from '@/use-cases/user/sign-in/interfaces';
import { InvalidEmailOrPasswordError } from '@/use-cases/user/errors';
import { Either, error, success } from '@/shared';

type Response = Either<
  InvalidNameError |
  InvalidEmailError |
  InvalidPasswordError |
  InvalidEmailOrPasswordError,
  IUserRepositoryReturnData
>;

export class SignInUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashCompare: IHashCompare,
    private readonly encrypter: IEncrypter,
  ) { }

  async execute({ email, password }: IUserSignIn): Promise<Response> {
    const userOrError = User.create({ email, password });
    if (userOrError.isError()) return error(userOrError.value);

    const userOrNull = await this.userRepository.findByEmail(email);
    if (!userOrNull || !userOrNull.password) {
      return error(new InvalidEmailOrPasswordError(email, password));
    }

    const comparePassword = await this.hashCompare.compare(userOrNull.password, password);
    if (!comparePassword) return error(new InvalidEmailOrPasswordError(email, password));

    const accessToken = await this.encrypter.encrypt(userOrNull.id);

    const userData = await this.userRepository.updateByEmail(email, {
      accessToken,
    });

    return success(userData);
  }
}
