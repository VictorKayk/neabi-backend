import { IUserRepository, IUserVisibleData } from '@/use-cases/user/interfaces';
import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingUserError } from '@/use-cases/user/errors';
import { Either, error, success } from '@/shared';
import { getUserVisibleData } from '@/use-cases/user/utils';

type Response = Either<NonExistingUserError, IUserVisibleData>;

export class DeleteUserUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const userOrNull = await this.userRepository.findById(id);
    if (!userOrNull) return error(new NonExistingUserError());

    const deletedUser = await this.userRepository.deleteById(id);
    const userVisibleData = getUserVisibleData(deletedUser);

    return success(userVisibleData);
  }
}
