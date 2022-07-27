import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError } from '@/entities/errors';
import {
  IIdGenerator,
  IUseCase,
  IUserData,
  IUserVisibleData,
  IUserRepository,
  IEncrypter,
  IUserRepositoryReturnData,
} from '@/use-cases/interfaces';
import { getUserVisibleData } from '@/use-cases/util';
import { Either, error, success } from '@/shared';

type Response = Either<
  InvalidNameError |
  InvalidEmailError,
  IUserVisibleData
>;

export class ExternalSignInUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly encrypter: IEncrypter,
  ) { }

  async execute({ name, email }: IUserData): Promise<Response> {
    const userOrError = User.create({ name, email });
    if (userOrError.isError()) return error(userOrError.value);

    let id: string;
    let userOrNull;
    do {
      id = await this.idGenerator.generate();
      userOrNull = await this.userRepository.findById(id);
    } while (userOrNull);

    const accessToken = await this.encrypter.encrypt(id);

    let userData: IUserRepositoryReturnData;
    userOrNull = await this.userRepository.findByEmail(email);
    if (userOrNull) {
      userData = await this.userRepository.updateByEmail(email, {
        accessToken,
      });
    } else {
      userData = await this.userRepository.add({
        id,
        name,
        email,
        accessToken,
      });
    }

    const userVisibleData = getUserVisibleData(userData);
    return success(userVisibleData);
  }
}
