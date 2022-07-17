import { IUseCase, IUserRepository, IUserRepositoryData } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/errors';
import { Either, error, success } from '@/shared';

type Response = Either<NonExistingUserError, IUserRepositoryData>;

export class ReadUserUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const userOrNull = await this.userRepository.findById(id);
    if (!userOrNull) return error(new NonExistingUserError());

    const user: IUserRepositoryData = userOrNull;

    return success(user);
  }
}
