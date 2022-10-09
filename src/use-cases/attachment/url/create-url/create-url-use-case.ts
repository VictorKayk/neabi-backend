import { IUseCase, IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { Either, error, success } from '@/shared';
import { IUrlRepositoryReturnData, IUrlRepository } from '@/use-cases/attachment/url/interfaces';
import { ExistingUrlError } from '@/use-cases/attachment/url/errors';

type Response = Either<ExistingUrlError, IUrlRepositoryReturnData>;
type Request = {
  name: string,
  url: string,
}

export class CreateUrlUseCase implements IUseCase {
  constructor(
    private readonly urlRepository: IUrlRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute({ name, url }: Request): Promise<Response> {
    let urlOrNull = await this.urlRepository.findByUrl(url);
    if (urlOrNull && urlOrNull.name === name) return error(new ExistingUrlError());

    let id: string;
    do {
      id = await this.idGenerator.generate();
      urlOrNull = await this.urlRepository.findById(id);
    } while (urlOrNull);

    const urlData = await this.urlRepository.add({ id, name, url });

    return success(urlData);
  }
}
