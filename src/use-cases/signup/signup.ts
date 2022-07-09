import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import {
  IHasher,
  IIdGenerator,
  IUseCase,
  IUserData,
  IUserRepository,
} from '@/use-cases/interfaces';
import { ExistingUserError } from '@/use-cases/errors/existing-user-error';
import { Either, error, success } from '@/shared';

type Response = Either<
  InvalidNameError |
  InvalidEmailError |
  InvalidPasswordError |
  ExistingUserError,
  string
>;

export class SignUp implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly idGenerator: IIdGenerator,
  ) { }

  async execute({ name, email, password }: IUserData): Promise<Response> {
    const userOrError = User.create(name, email, password);
    if (userOrError.isError()) return error(userOrError.value);

    const userOrNull = await this.userRepository.findByEmail(email);
    if (userOrNull) return error(new ExistingUserError());

    await this.hasher.hash(password);
    await this.idGenerator.generate();

    return new Promise((resolve) => resolve(success('')));
  }
}
