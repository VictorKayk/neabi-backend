import { PostRepository } from '@/infra/repositories';
import prisma from '@/main/config/prisma';

type SutTypes = {
  sut: PostRepository,
};

const makeSut = (): SutTypes => {
  const sut = new PostRepository();

  return {
    sut,
  };
};

describe('Post Repository Implementation', () => {
  it('Should return an post on add success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.post, 'create').mockResolvedValue({
      id: 'any_id',
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_description',
      descriptionHtml: 'any_descriptionHtml',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await sut.add({
      id: 'any_id',
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_description',
      descriptionHtml: 'any_descriptionHtml',
    });
    expect(response).toEqual({
      id: 'any_id',
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_description',
      descriptionHtml: 'any_descriptionHtml',
      isDeleted: false,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    });
  });

  it('Should return an post on findById success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.post, 'findFirst').mockResolvedValue({
      id: 'any_id',
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_description',
      descriptionHtml: 'any_descriptionHtml',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.findById('any_id');
    expect(response).toEqual({
      id: 'any_id',
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_description',
      descriptionHtml: 'any_descriptionHtml',
      isDeleted: false,
      createdAt: response?.createdAt,
      updatedAt: response?.updatedAt,
    });
  });

  it('Should return null on findById fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.post, 'findFirst').mockResolvedValue(null);

    const response = await sut.findById('any_id');
    expect(response).toBe(null);
  });

  it('Should return an post on findBySlug success', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.post, 'findFirst').mockResolvedValue({
      id: 'any_id',
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_description',
      descriptionHtml: 'any_descriptionHtml',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    const response = await sut.findBySlug('any_slug');
    expect(response).toEqual({
      id: 'any_id',
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_description',
      descriptionHtml: 'any_descriptionHtml',
      isDeleted: false,
      createdAt: response?.createdAt,
      updatedAt: response?.updatedAt,
    });
  });

  it('Should return null on findBySlug fails', async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.post, 'findFirst').mockResolvedValue(null);

    const response = await sut.findBySlug('any_slug');
    expect(response).toBe(null);
  });
});
