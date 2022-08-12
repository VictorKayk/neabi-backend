import { User } from '@/entities/user';
import { InvalidNameError, InvalidEmailError } from '@/entities/value-object/errors';
import {
  IUserData,
  IUserRepository,
  IEncrypter,
  IUserRepositoryReturnData,
} from '@/use-cases/user/interfaces';
import { IUniversallyUniqueIdentifierGenerator, IUseCase } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';

type Response = Either<
  InvalidNameError |
  InvalidEmailError,
  IUserRepositoryReturnData
>;

export class ExternalSignInUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
    private readonly encrypter: IEncrypter,
  ) { }

  async execute({ name, email }: IUserData): Promise<Response> {
    const userOrError = User.create({ name, email });
    if (userOrError.isError()) return error(userOrError.value);

    let userData: IUserRepositoryReturnData;
    let userOrNull = await this.userRepository.findByEmail(email);

    if (userOrNull) {
      const accessToken = await this.encrypter.encrypt(userOrNull.id);

      userData = await this.userRepository.updateByEmail(email, {
        accessToken,
      });
    } else {
      let id: string;
      do {
        id = await this.idGenerator.generate();
        userOrNull = await this.userRepository.findById(id);
      } while (userOrNull);

      const accessToken = await this.encrypter.encrypt(id);

      userData = await this.userRepository.add({
        id,
        name,
        email,
        accessToken,
      });
    }

    return success(userData);
  }
}
