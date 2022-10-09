import { IUseCase } from '@/use-cases/interfaces';
import { IUrlRepositoryReturnData, IUrlRepository, IUrlDataQuery } from '@/use-cases/attachment/url/interfaces';

type Response = IUrlRepositoryReturnData[] | [];

export class ReadAllUrlsUseCase implements IUseCase {
  constructor(
    private readonly urlRepository: IUrlRepository,
  ) { }

  async execute(urlDataQuery: IUrlDataQuery): Promise<Response> {
    const urls = await this.urlRepository.readAllUrls(urlDataQuery);
    return urls;
  }
}
