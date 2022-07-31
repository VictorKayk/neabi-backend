import { InvalidEmailError } from '@/entities/value-object/errors';
import { SignUpUseCase } from '@/use-cases/user/sign-up';
import { IEncrypter } from '@/use-cases/user/interfaces';
import { IIdGenerator } from '@/use-cases/interfaces';
import { ExistingUserError } from '@/use-cases/user/errors';
import { SignUpController } from '@/adapters/controllers/user/sign-up';
import { IValidation } from '@/adapters/controllers/interfaces';
import { ServerError } from '@/adapters/errors';
import { MissingParamsError } from '@/adapters/controllers/errors';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/util/http';
import {
  makeSignUpUseCase,
  makeFakeRequest,
  makeEncrypter,
  makeIdGenerator,
  makeValidation,
} from '@/test/stubs';
import { error } from '@/shared';

type SutTypes = {
  sut: SignUpController,
  validation: IValidation,
  useCase: SignUpUseCase,
  idGenerator: IIdGenerator,
  encrypter: IEncrypter,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeSignUpUseCase();
  const sut = new SignUpController(validation, useCase);
  const idGenerator = makeIdGenerator();
  const encrypter = makeEncrypter();

  return {
    sut,
    validation,
    useCase,
    encrypter,
    idGenerator,
  };
};

describe('SignUpUseCase Controller ', () => {
  it('Should call SignUpUseCase with correct values', async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, 'execute');

    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledWith({
      name: makeFakeRequest().body.name,
      email: makeFakeRequest().body.email,
      password: makeFakeRequest().body.password,
    });
  });

  it('Should return 500 if throws', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 201 on success', async () => {
    const { sut, encrypter, idGenerator } = makeSut();
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(created({
      id: await idGenerator.generate(),
      name: makeFakeRequest().body.name,
      email: makeFakeRequest().body.email,
      accessToken: await encrypter.encrypt(await idGenerator.generate()),
      createdAt: response.body.createdAt,
      updatedAt: response.body.updatedAt,
    }));
  });

  it('Should return 400 if call SignUpUseCase with incorrect values', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({
      body: {
        name: makeFakeRequest().body.name,
        email: '',
        password: makeFakeRequest().body.password,
      },
    });
    expect(response).toEqual(badRequest(new InvalidEmailError('')));
  });

  it('Should return 403 if user already exists', async () => {
    const { sut, useCase } = makeSut();

    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new ExistingUserError()),
    )));

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(forbidden(new ExistingUserError()));
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut();
    const validationSpy = jest.spyOn(validation, 'validate');
    await sut.handle(makeFakeRequest());
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest().body);
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamsError('any_field'));
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')));
  });
});
