import { IUserDataQuery, IUserRepository, IUserRepositoryReturnData } from '@/use-cases/user/interfaces';
import { IUseCase } from '@/use-cases/interfaces';

type Response = IUserRepositoryReturnData[] | [];

export class ReadAllUsersUseCase implements IUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(userQuery: IUserDataQuery): Promise<Response> {
    const users = await this.userRepository.readAllUsers(userQuery);
    return users;
  }
}
