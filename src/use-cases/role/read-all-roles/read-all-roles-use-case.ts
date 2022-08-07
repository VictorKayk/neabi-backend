import { IUseCase } from '@/use-cases/interfaces';
import { IRoleRepositoryReturnData, IRoleRepository, IRoleDataQuery } from '@/use-cases/role/interfaces';

type Response = IRoleRepositoryReturnData[] | [];

export class ReadAllRolesUseCase implements IUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
  ) { }

  async execute(roleDataQuery: IRoleDataQuery): Promise<Response> {
    const roles = await this.roleRepository.readAllRoles(roleDataQuery);
    return roles;
  }
}
