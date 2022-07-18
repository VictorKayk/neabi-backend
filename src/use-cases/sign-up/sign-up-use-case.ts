import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import {
  IHasher,
  IIdGenerator,
  IUseCase,
  IUserData,
  IUserVisibleData,
  IUserRepository,
  IEncrypter,
} from '@/use-cases/interfaces';
import { ExistingUserError } from '@/use-cases/errors/existing-user-error';
import { getUserVisibleData } from '@/use-cases/util';
import { Either, error, success } from '@/shared';

type Response = Either<
  InvalidNameError |
  InvalidEmailError |
  InvalidPasswordError |
  ExistingUserError,
  IUserVisibleData
>;

export class SignUpUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly idGenerator: IIdGenerator,
    private readonly encrypter: IEncrypter,
  ) { }

  async execute({ name, email, password }: IUserData): Promise<Response> {
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

    const userVisibleData = getUserVisibleData(userData);

    return success(userVisibleData);
  }
}
