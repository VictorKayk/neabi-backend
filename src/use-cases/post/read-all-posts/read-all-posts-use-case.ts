import { IUseCase } from '@/use-cases/interfaces';
import { IPostRepositoryReturnData, IPostRepository, IPostDataQuery } from '@/use-cases/post/interfaces';

type Response = IPostRepositoryReturnData[] | [];

export class ReadAllPostsUseCase implements IUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
  ) { }

  async execute(postDataQuery: IPostDataQuery): Promise<Response> {
    const posts = await this.postRepository.readAllPosts(postDataQuery);
    return posts;
  }
}
