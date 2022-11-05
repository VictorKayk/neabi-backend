import { IUseCase, IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { ITagRepositoryReturnData, ITagRepository } from '@/use-cases/tag/interfaces';
import { ExistingTagError } from '@/use-cases/tag/errors';

import { Either, error, success } from '@/shared';

type Response = Either<ExistingTagError, ITagRepositoryReturnData>;

export class CreateTagUseCase implements IUseCase {
  constructor(
    private readonly tagRepository: ITagRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute(tag: string): Promise<Response> {
    const newTag = tag.toLocaleLowerCase();

    let tagOrNull = await this.tagRepository.findByTag(newTag);
    if (tagOrNull) {
      if (!tagOrNull.isDeleted) return error(new ExistingTagError());

      const tagData = await this.tagRepository.updateById(tagOrNull.id, { isDeleted: false });
      return success(tagData);
    }

    let id: string;
    do {
      id = await this.idGenerator.generate();
      tagOrNull = await this.tagRepository.findById(id);
    } while (tagOrNull);

    const tagData = await this.tagRepository.add({ id, tag: newTag });

    return success(tagData);
  }
}
