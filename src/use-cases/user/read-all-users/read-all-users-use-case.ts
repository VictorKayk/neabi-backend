import { IUseCase, IUserRepository, IUserVisibleData } from '@/use-cases/user/interfaces';
import { getUserVisibleData } from '@/use-cases/user/util';

type Response = IUserVisibleData[] | [];

export class ReadAllUsersUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(): Promise<Response> {
    const users = await this.userRepository.readAllUsers();
    const usersVisibleData = users.map((user) => getUserVisibleData(user));
    return usersVisibleData;
  }
}
