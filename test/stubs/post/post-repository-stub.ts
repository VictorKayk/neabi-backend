import {
  IPostRepository,
  IPostData,
  IPostRepositoryReturnData,
  IPostDataQuery,
  IPostEditableData,
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

    async updateById(id: string, postEditableData: IPostEditableData):
      Promise<IPostRepositoryReturnData> {
      return {
        id: 'any_id',
        title: 'any_title',
        slug: 'any_slug',
        description: 'any_description',
        descriptionHtml: 'any_descriptionHtml',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };
    }
  }
  return new PostRepositoryStub();
};
