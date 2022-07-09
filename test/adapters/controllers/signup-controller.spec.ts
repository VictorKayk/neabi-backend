import { SignUp } from '@/use-cases/signup';
import { IHasher, IIdGenerator, IEncrypter } from '@/use-cases/interfaces';
import { SignUpController } from '@/adapters/controllers/signup-controller';
import { IValidation } from '@/adapters/interfaces';
import { ServerError, MissingParamsError } from '@/adapters/errors';
import { created, serverError, badRequest } from '@/adapters/util/http';
import {
  makeSignUpUseCase,
  makeFakeRequest,
  makeHasher,
  makeEncrypter,
  makeIdGenerator,
  makeValidation,
} from '@/test/stubs';

type SutTypes = {
  sut: SignUpController,
  validation: IValidation,
  useCase: SignUp,
  hasher: IHasher,
  idGenerator: IIdGenerator,
  encrypter: IEncrypter,
};

const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const useCase = makeSignUpUseCase();
  const sut = new SignUpController(validation, useCase);

  const hasher = makeHasher();
  const idGenerator = makeIdGenerator();
  const encrypter = makeEncrypter();
  return {
    sut,
    validation,
    useCase,
    hasher,
    encrypter,
    idGenerator,
  };
};

describe('SignUp Controller ', () => {
  it('Should call SignUp use case with correct values', async () => {
    const { sut, useCase } = makeSut();
    const useCaseSpy = jest.spyOn(useCase, 'execute');
    await sut.handle(makeFakeRequest());
    expect(useCaseSpy).toHaveBeenCalledWith({
      name: makeFakeRequest().body.name,
      email: makeFakeRequest().body.email,
      password: makeFakeRequest().body.password,
    });
  });

  it('Should return 500 if use case throws', async () => {
    const { sut, useCase } = makeSut();
    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(serverError(new ServerError()));
  });

  it('Should return 201 on success', async () => {
    const {
      sut,
      hasher,
      encrypter,
      idGenerator,
    } = makeSut();

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(created({
      id: await idGenerator.generate(),
      name: makeFakeRequest().body.name,
      email: makeFakeRequest().body.email,
      password: await hasher.hash(makeFakeRequest().body.password),
      accessToken: await encrypter.encrypt(await idGenerator.generate()),
    }));
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
