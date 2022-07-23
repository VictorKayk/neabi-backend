import { IUseCase, IUserRepository, IUserVisibleData } from '@/use-cases/interfaces';
import { getUserVisibleData } from '@/use-cases/util';

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
