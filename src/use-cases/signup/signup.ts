import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import { Either, error, success } from '@/shared';
import { IUseCase, IUserData } from '@/use-cases/interfaces';

export class SignUp implements IUseCase {
  async execute({ name, email, password }: IUserData):
    Promise<Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, string>> {
    const userOrError = User.create(name, email, password);
    if (userOrError.isError()) return error(userOrError.value);
    return new Promise((resolve) => resolve(success('')));
  }
}
