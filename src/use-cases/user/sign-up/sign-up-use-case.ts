import { User } from '@/entities/user';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/value-object/errors';
import {
  IHasher,
  IUserRepositoryReturnData,
  IUserRepository,
  IEncrypter,
} from '@/use-cases/user/interfaces';
import { IUniversallyUniqueIdentifierGenerator, IUseCase } from '@/use-cases/interfaces';
import { IUserRequired } from '@/use-cases/user/sign-up/interfaces';
import { ExistingUserError } from '@/use-cases/user/errors/existing-user-error';
import { Either, error, success } from '@/shared';

type Response = Either<
  InvalidNameError |
  InvalidEmailError |
  InvalidPasswordError |
  ExistingUserError,
  IUserRepositoryReturnData
>;

export class SignUpUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
    private readonly encrypter: IEncrypter,
  ) { }

  async execute({ name, email, password }: IUserRequired): Promise<Response> {
    const userOrError = User.create({ name, email, password });
    if (userOrError.isError()) return error(userOrError.value);

    let userOrNull = await this.userRepository.findByEmail(email);
    if (userOrNull) return error(new ExistingUserError());

    let id: string;
    do {
      id = await this.idGenerator.generate();
      userOrNull = await this.userRepository.findById(id);
    } while (userOrNull);

    const accessToken = await this.encrypter.encrypt(id);
    const hashedPassword = await this.hasher.hash(password);

    const userData = await this.userRepository.add({
      id,
      name,
      email,
      password: hashedPassword,
      accessToken,
    });

    return success(userData);
  }
}
