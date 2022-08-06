import { User } from '@/entities/user';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/value-object/errors';
import {
  IHasher,
  IUserEditableData,
  IUserVisibleData,
  IUserRepository,
} from '@/use-cases/user/interfaces';
import { IUseCase } from '@/use-cases/interfaces';
import { ExistingUserError, NonExistingUserError } from '@/use-cases/user/errors';
import { getUserVisibleData } from '@/use-cases/user/utils';
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
      if (userOrNull && userOrNull.id !== id) return error(new ExistingUserError());
    }

    let newPassword;
    if (password) {
      if (userOrNull?.password === null) return error(new InvalidPasswordError(password));
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
