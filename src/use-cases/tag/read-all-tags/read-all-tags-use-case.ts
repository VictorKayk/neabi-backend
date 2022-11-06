import { IUseCase } from '@/use-cases/interfaces';
import { ITagRepositoryReturnData, ITagRepository, ITagDataQuery } from '@/use-cases/tag/interfaces';

type Response = ITagRepositoryReturnData[] | [];

export class ReadAllTagsUseCase implements IUseCase {
  constructor(
    private readonly tagRepository: ITagRepository,
  ) { }

  async execute(tagDataQuery: ITagDataQuery): Promise<Response> {
    const tags = await this.tagRepository.readAllTags(tagDataQuery);
    return tags;
  }
}
