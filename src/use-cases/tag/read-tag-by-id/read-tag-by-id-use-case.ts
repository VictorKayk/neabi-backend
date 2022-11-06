import { IUseCase } from '@/use-cases/interfaces';
import { ITagRepositoryReturnData, ITagRepository } from '@/use-cases/tag/interfaces';
import { NonExistingTagError } from '@/use-cases/tag/errors';

import { Either, error, success } from '@/shared';

type Response = Either<NonExistingTagError, ITagRepositoryReturnData>;

export class ReadTagByIdUseCase implements IUseCase {
  constructor(
    private readonly tagRepository: ITagRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const tagOrNull = await this.tagRepository.findById(id);
    if (!tagOrNull) return error(new NonExistingTagError());
    return success(tagOrNull);
  }
}
