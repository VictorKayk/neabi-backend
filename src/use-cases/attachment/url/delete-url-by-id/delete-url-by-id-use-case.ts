import { IUseCase } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';
import { NonExistingUrlError } from '@/use-cases/attachment/url/errors';
import { IUrlRepositoryReturnData, IUrlRepository } from '@/use-cases/attachment/url/interfaces';

type Response = Either<NonExistingUrlError, IUrlRepositoryReturnData>;

export class DeleteUrlByIdUseCase implements IUseCase {
  constructor(
    private readonly urlRepository: IUrlRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const urlOrNull = await this.urlRepository.findById(id);
    if (!urlOrNull) return error(new NonExistingUrlError());

    const urlData = await this.urlRepository.deleteUrlById(id);

    return success(urlData);
  }
}
