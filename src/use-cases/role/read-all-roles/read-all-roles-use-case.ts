import { IUseCase } from '@/use-cases/interfaces';
import { IRoleRepositoryReturnData, IRoleRepository } from '@/use-cases/role/interfaces';

type Response = IRoleRepositoryReturnData[] | [];

export class ReadAllRolesUseCase implements IUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
  ) { }

  async execute(): Promise<Response> {
    const roles = await this.roleRepository.readAllRoles();
    return roles;
  }
}
