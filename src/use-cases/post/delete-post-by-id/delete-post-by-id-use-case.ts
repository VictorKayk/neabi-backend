import { IUseCase } from '@/use-cases/interfaces';
import { IPostRepositoryReturnData, IPostRepository } from '@/use-cases/post/interfaces';
import { Either, error, success } from '@/shared';
import { NonExistingPostError } from '@/use-cases/post/errors';

type Response = Either<NonExistingPostError, IPostRepositoryReturnData>;

export class DeletePostByIdUseCase implements IUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
  ) { }

  async execute(id: string): Promise<Response> {
    const postOrNull = await this.postRepository.findById(id);
    if (!postOrNull) return error(new NonExistingPostError());

    const post = await this.postRepository.deleteById(id);
    return success(post);
  }
}
