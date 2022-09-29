import {
  IPostRepository,
  IPostData,
  IPostRepositoryReturnData,
  IPostDataQuery,
} from '@/use-cases/post/interfaces';

export const makePostRepository = (): IPostRepository => {
  class PostRepositoryStub implements IPostRepository {
    async findById(id: string): Promise<IPostRepositoryReturnData | null> {
      return null;
    }

    async findBySlug(slug: string): Promise<IPostRepositoryReturnData | null> {
      return null;
    }

    async add(postData: IPostData): Promise<IPostRepositoryReturnData> {
      return {
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };
    }

    async readAllPosts(postDataQuery: IPostDataQuery): Promise<IPostRepositoryReturnData[] | []> {
      return [];
    }
  }
  return new PostRepositoryStub();
};
