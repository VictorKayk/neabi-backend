import { IUseCase } from '@/use-cases/interfaces';
import { ITagRepositoryReturnData, ITagData, ITagRepository } from '@/use-cases/tag/interfaces';
import { NonExistingTagError, ExistingTagError } from '@/use-cases/tag/errors';
import { Either, error, success } from '@/shared';

type Response = Either<NonExistingTagError, ITagRepositoryReturnData>;

export class UpdateTagByIdUseCase implements IUseCase {
  constructor(
    private readonly tagRepository: ITagRepository,
  ) { }

  async execute({ id, tag }: ITagData): Promise<Response> {
    let tagOrNull = await this.tagRepository.findById(id);
    if (!tagOrNull || tagOrNull.isDeleted) return error(new NonExistingTagError());

    tagOrNull = await this.tagRepository.findByTag(tag);
    if (tagOrNull && tagOrNull.id !== id) return error(new ExistingTagError());

    const tagUpdated = await this.tagRepository.updateById(id, { tag });
    return success(tagUpdated);
  }
}
