import { IUseCase } from '@/use-cases/interfaces';
import { IUrlRepositoryReturnData, IUrlRepository } from '@/use-cases/attachment/url/interfaces';
import { NonExistingUrlError } from '@/use-cases/attachment/url/errors';

import { Either, error, success } from '@/shared';

type Response = Either<NonExistingUrlError, IUrlRepositoryReturnData>;

export class ReadUrlByIdUseCase implements IUseCase {
  constructor(
    private readonly urlRepository: IUrlRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const urlOrNull = await this.urlRepository.findById(id);
    if (!urlOrNull) return error(new NonExistingUrlError());
    return success(urlOrNull);
  }
}
