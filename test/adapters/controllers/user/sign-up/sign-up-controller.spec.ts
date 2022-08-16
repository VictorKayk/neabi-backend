import { InvalidEmailError } from '@/entities/value-object/errors';
import { SignUpUseCase } from '@/use-cases/user/sign-up';
import { IEncrypter } from '@/use-cases/user/interfaces';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';
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
} from '@/adapters/utils/http';
import {
  makeSignUpUseCase,
  makeFakeRequest,
  makeEncrypter,
  makeUniversallyUniqueIdentifierGenerator,
  makeValidation,
} from '@/test/stubs';
import { error } from '@/shared';

type SutTypes = {
  sut: SignUpController,
  validation: IValidation,
  signUpUseCase: SignUpUseCase,
  idGenerator: IUniversallyUniqueIdentifierGenerator,
  encrypter: IEncrypter,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const signUpUseCase = makeSignUpUseCase();
  const sut = new SignUpController(validation, signUpUseCase);
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  const encrypter = makeEncrypter();

  return {
    sut,
    validation,
    signUpUseCase,
    encrypter,
    idGenerator,
  };
};

describe('SignUpUseCase Controller ', () => {
  it('Should call SignUpUseCase with correct values', async () => {
    const { sut, signUpUseCase } = makeSut();

    const useCaseSpy = jest.spyOn(signUpUseCase, 'execute');

    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledWith({
      name: makeFakeRequest().body.name,
      email: makeFakeRequest().body.email,
      password: makeFakeRequest().body.password,
    });
  });

  it('Should return 500 if SignUpUseCase throws', async () => {
    const { sut, signUpUseCase } = makeSut();

    jest.spyOn(signUpUseCase, 'execute').mockImplementationOnce(() => { throw new Error(); });

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 201 on SignUpUseCase success', async () => {
    const { sut, encrypter, idGenerator } = makeSut();

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(created({
      id: await idGenerator.generate(),
      name: makeFakeRequest().body.name,
      email: makeFakeRequest().body.email,
      isVerified: false,
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
    const { sut, signUpUseCase } = makeSut();

    jest.spyOn(signUpUseCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
      error(new ExistingUserError()),
    )));

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(forbidden(new ExistingUserError()));
  });

  it('Should return 403 if user already exists', async () => {
    const { sut, signUpUseCase } = makeSut();

    jest.spyOn(signUpUseCase, 'execute').mockImplementationOnce(() => new Promise((resolve) => resolve(
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
