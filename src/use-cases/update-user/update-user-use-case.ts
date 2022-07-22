import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import {
  IHasher,
  IUseCase,
  IUserEditableData,
  IUserVisibleData,
  IUserRepository,
} from '@/use-cases/interfaces';
import { ExistingUserError, NonExistingUserError } from '@/use-cases/errors';
import { getUserVisibleData } from '@/use-cases/util';
import { Either, error, success } from '@/shared';

interface Request {
  id: string,
  userData: IUserEditableData
}

type Response = Either<
  InvalidNameError |
  InvalidEmailError |
  InvalidPasswordError |
  NonExistingUserError |
  ExistingUserError,
  IUserVisibleData
>;

export class UpdateUserUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) { }

  async execute({ id, userData: { name, email, password } }: Request): Promise<Response> {
    const userOrError = User.create({ name, email, password });
    if (userOrError.isError()) return error(userOrError.value);

    let userOrNull = await this.userRepository.findById(id);
    if (!userOrNull) return error(new NonExistingUserError());

    if (email) {
      userOrNull = await this.userRepository.findByEmail(email);
      if (userOrNull) return error(new ExistingUserError());
    }

    let newPassword;
    if (password) {
      newPassword = await this.hasher.hash(password);
    }

    const userData = await this.userRepository.updateById(id, {
      name,
      email,
      password: newPassword,
    });

    const userVisibleData = getUserVisibleData(userData);

    return success(userVisibleData);
  }
}
