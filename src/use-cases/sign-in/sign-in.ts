import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import {
  IHashCompare,
  IUseCase,
  IUserSignIn,
  IUserRepositoryData,
  IUserRepository,
  IEncrypter,
} from '@/use-cases/interfaces';
import { InvalidEmailOrPasswordError } from '@/use-cases/errors';
import { Either, error, success } from '@/shared';

type Response = Either<
  InvalidNameError |
  InvalidEmailError |
  InvalidPasswordError |
  InvalidEmailOrPasswordError,
  IUserRepositoryData
>;

export class SignIn implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashCompare: IHashCompare,
    private readonly encrypter: IEncrypter,
  ) { }

  async execute({ email, password }: IUserSignIn): Promise<Response> {
    const userOrError = User.create({ email, password });
    if (userOrError.isError()) return error(userOrError.value);

    const userOrNull = await this.userRepository.findByEmail(email);
    if (!userOrNull) return error(new InvalidEmailOrPasswordError(email, password));

    const comparePassword = await this.hashCompare.compare(userOrNull.password, password);
    if (!comparePassword) return error(new InvalidEmailOrPasswordError(email, password));

    const accessToken = await this.encrypter.encrypt(userOrNull.id);

    const user: IUserRepositoryData = await this.userRepository.updateByEmail(email, {
      accessToken,
    });

    return success(user);
  }
}