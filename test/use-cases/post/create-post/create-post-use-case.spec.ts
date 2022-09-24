import {
  IUniversallyUniqueIdentifierGenerator,
  ISanitizeHtml,
  IStripHtml,
  ISlugGenerator,
} from '@/use-cases/interfaces';
import { IPostRepositoryReturnData, IPostRepository } from '@/use-cases/post/interfaces';
import {
  makeUniversallyUniqueIdentifierGenerator,
  makePostRepository,
  makeSanitizeHtml,
  makeStripHtml,
  makeSlugGenerator,
} from '@/test/stubs';
import { Post } from '@/entities/post';
import { InvalidTitleError } from '@/entities/value-object/errors';
import { CreatePostUseCase } from '@/use-cases/post/create-post';

type SutTypes = {
  sut: CreatePostUseCase,
  postRepository: IPostRepository,
  sanitizeHtml: ISanitizeHtml,
  stripHtml: IStripHtml,
  slugGenerator: ISlugGenerator,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
};

const makeSut = (): SutTypes => {
  const postRepository = makePostRepository();
  const sanitizeHtml = makeSanitizeHtml();
  const stripHtml = makeStripHtml();
  const slugGenerator = makeSlugGenerator();
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const sut = new CreatePostUseCase(
    sanitizeHtml, stripHtml, slugGenerator, postRepository, idGenerator,
  );

  return {
    sut,
    postRepository,
    sanitizeHtml,
    stripHtml,
    slugGenerator,
    idGenerator,
  };
};

describe('CreatePostUseCase', () => {
  it('Should call sanitizeHtml with correct value', async () => {
    const { sut, sanitizeHtml } = makeSut();
    const sanitizeHtmlSpy = jest.spyOn(sanitizeHtml, 'sanitize');
    await sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    expect(sanitizeHtmlSpy).toHaveBeenCalledWith('<strong>any_description</strong>');
  });

  it('Should throw if sanitizeHtml throws', async () => {
    const { sut, sanitizeHtml } = makeSut();
    jest.spyOn(sanitizeHtml, 'sanitize').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    await expect(promise).rejects.toThrow();
  });

  it('Should call stripHtml with correct value', async () => {
    const { sut, stripHtml } = makeSut();
    const stripHtmlSpy = jest.spyOn(stripHtml, 'strip');
    await sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    expect(stripHtmlSpy).toHaveBeenCalledWith('any_sanitized_html');
  });

  it('Should throw if stripHtml throws', async () => {
    const { sut, stripHtml } = makeSut();
    jest.spyOn(stripHtml, 'strip').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    await expect(promise).rejects.toThrow();
  });

  it('Should call slugGenerator with correct value', async () => {
    const { sut, slugGenerator } = makeSut();
    const slugGeneratorSpy = jest.spyOn(slugGenerator, 'generate');
    await sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    expect(slugGeneratorSpy).toHaveBeenCalledWith('any_title');
  });

  it('Should throw if slugGenerator throws', async () => {
    const { sut, slugGenerator } = makeSut();
    jest.spyOn(slugGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    await expect(promise).rejects.toThrow();
  });

  it('Should call findBySlug with correct post', async () => {
    const { sut, postRepository } = makeSut();
    const postRepositorySpy = jest.spyOn(postRepository, 'findBySlug');
    await sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    expect(postRepositorySpy).toHaveBeenCalledWith('any_slug');
  });

  it('Should throw if findBySlug throws', async () => {
    const { sut, postRepository } = makeSut();
    jest.spyOn(postRepository, 'findBySlug').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    await expect(promise).rejects.toThrow();
  });

  it('Should call post entity with correct value', async () => {
    const { sut } = makeSut();
    const postSpy = jest.spyOn(Post, 'create');
    await sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    expect(postSpy).toHaveBeenCalledWith({ title: 'any_title', slug: 'any_slug', description: 'any_striped_html' });
  });

  it('Should return an error if post is invalid', async () => {
    const { sut } = makeSut();
    const error = await sut.execute({ title: '', description: '<strong>any_description</strong>' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidTitleError(''));
  });

  it('Should throw if IdGenerator throws', async () => {
    const { sut, idGenerator } = makeSut();
    jest.spyOn(idGenerator, 'generate').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    await expect(promise).rejects.toThrow();
  });

  it('Should call findById with correct value', async () => {
    const { sut, postRepository, idGenerator } = makeSut();
    const postRepositorySpy = jest.spyOn(postRepository, 'findById');
    await sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    expect(postRepositorySpy).toHaveBeenCalledWith(await idGenerator.generate());
  });

  it('Should throw if findById throws', async () => {
    const { sut, postRepository } = makeSut();
    jest.spyOn(postRepository, 'findById').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    await expect(promise).rejects.toThrow();
  });

  it('Should call add with correct values', async () => {
    const { sut, postRepository, idGenerator } = makeSut();

    const postRepositorySpy = jest.spyOn(postRepository, 'add');

    await sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    expect(postRepositorySpy).toHaveBeenCalledWith({
      id: await idGenerator.generate(),
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_striped_html',
      descriptionHtml: 'any_sanitized_html',
    });
  });

  it('Should throw if add throws', async () => {
    const { sut, postRepository } = makeSut();
    jest.spyOn(postRepository, 'add').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an post on success', async () => {
    const { sut, idGenerator } = makeSut();
    const response = await sut.execute({ title: 'any_title', description: '<strong>any_description</strong>' });
    const value = response.value as IPostRepositoryReturnData;
    expect(response.isSuccess()).toBe(true);
    expect(value).toEqual({
      id: await idGenerator.generate(),
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_striped_html',
      descriptionHtml: 'any_sanitized_html',
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      isDeleted: value.isDeleted,
    });
  });
});
