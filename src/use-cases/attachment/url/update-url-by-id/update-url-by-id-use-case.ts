import { IUrlRepositoryReturnData, IUrlEditableData, IUrlRepository } from '@/use-cases/attachment/url/interfaces';
import { NonExistingUrlError, ExistingUrlError } from '@/use-cases/attachment/url/errors';
import { Either, error, success } from '@/shared';
import { IUseCase } from '@/use-cases/interfaces';

interface Request {
  id: string,
  urlData: IUrlEditableData
}

type Response = Either<NonExistingUrlError, IUrlRepositoryReturnData>;

export class UpdateUrlByIdUseCase implements IUseCase {
  constructor(
    private readonly urlRepository: IUrlRepository,
  ) { }

  async execute({ id, urlData: { name, url } }: Request): Promise<Response> {
    const urlOrNull = await this.urlRepository.findById(id);
    if (!urlOrNull) return error(new NonExistingUrlError());

    if (urlOrNull.name === name) return error(new ExistingUrlError());

    const urlUpdated = await this.urlRepository.updateById(id, { name, url });
    return success(urlUpdated);
  }
}
