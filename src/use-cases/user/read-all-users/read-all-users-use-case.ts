import { IUserDataQuery, IUserRepository, IUserVisibleData } from '@/use-cases/user/interfaces';
import { IUseCase } from '@/use-cases/interfaces';
import { getUserVisibleData } from '@/use-cases/user/util';

type Response = IUserVisibleData[] | [];

export class ReadAllUsersUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(userQuery: IUserDataQuery): Promise<Response> {
    const users = await this.userRepository.readAllUsers(userQuery);
    const usersVisibleData = users.map((user) => getUserVisibleData(user));
    return usersVisibleData;
  }
}
