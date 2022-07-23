import { IUseCase, IUserRepository, IUserVisibleData } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/errors';
import { Either, error, success } from '@/shared';
import { getUserVisibleData } from '@/use-cases/util';

type Response = Either<NonExistingUserError, IUserVisibleData>;

export class ReadUserUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const userOrNull = await this.userRepository.findById(id);
    if (!userOrNull) return error(new NonExistingUserError());
    const userVisibleData = getUserVisibleData(userOrNull);

    return success(userVisibleData);
  }
}
