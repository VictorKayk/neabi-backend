import { CreatePostUseCase } from '@/use-cases/post/create-post';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { InvalidTitleError } from '@/entities/value-object/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import { created, serverError, badRequest } from '@/adapters/utils/http';
import { makeCreatePostUseCase, makeUniversallyUniqueIdentifierGenerator, makeValidation } from '@/test/stubs';
import { success } from '@/shared';
import { CreatePostController } from '@/adapters/controllers/post/create-post';

type SutTypes = {
  sut: CreatePostController,
  validation: IValidation,
  useCase: CreatePostUseCase,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeCreatePostUseCase();
  const sut = new CreatePostController(validation, useCase);
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();

  return {
    sut,
    validation,
    useCase,
    idGenerator,
  };
};

describe('CreatePost Controller ', () => {
  it('Should call CreatePostUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle({ body: { title: 'any_title', description: '<p>any_description</p>' } });
    expect(useCaseSpy).toHaveBeenCalledWith({ title: 'any_title', description: '<p>any_description</p>' });
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle({ body: { title: 'any_title', description: '<p>any_description</p>' } });
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 201 on success', async () => {
    const { sut, idGenerator, useCase } = makeSut();

    const useCaseReturn = {
      id: await idGenerator.generate(),
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_description',
      descriptionHtml: '<p>any_description</p>',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(useCase, 'execute').mockResolvedValue(success(useCaseReturn));

    const response = await sut.handle({ body: { title: 'any_title', description: '<p>any_description</p>' } });
    expect(response).toEqual(created(useCaseReturn));
  });

  it('Should return 400 if call CreatePostUseCase with incorrect values', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { title: '' } });
    expect(response).toEqual(badRequest(new InvalidTitleError('')));
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle({ body: { title: 'any_title', description: '<p>any_description</p>' } });
    expect(validationSpy).toHaveBeenCalledWith({ title: 'any_title', description: '<p>any_description</p>' });
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle({ body: { title: 'any_title', description: '<p>any_description</p>' } });
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
