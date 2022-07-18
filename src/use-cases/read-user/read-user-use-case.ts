import { IUseCase, IUserRepository, IUserVisibleData } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/errors';
import { Either, error, success } from '@/shared';

type Response = Either<NonExistingUserError, IUserVisibleData>;

export class ReadUserUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const userOrNull = await this.userRepository.findById(id);
    if (!userOrNull) return error(new NonExistingUserError());

    const user: IUserVisibleData = {
      id: userOrNull.id,
      name: userOrNull.name,
      email: userOrNull.email,
      createdAt: userOrNull.createdAt,
      updatedAt: userOrNull.updatedAt,
    };

    return success(user);
  }
}
