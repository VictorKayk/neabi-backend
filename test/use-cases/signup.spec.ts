import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import { SignUp } from '@/use-cases/signup';
import { IUserData, IUserRepository } from '@/use-cases/interfaces';
import { ExistingUserError } from '@/use-cases/errors/existing-user-error';

type SutTypes = {
  sut: SignUp,
  userRepository: IUserRepository
}

const makeUserRepository = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async findByEmail(email: string): Promise<IUserData | null> {
      return null;
    }
  }
  return new UserRepositoryStub();
};

const makeSut = (): SutTypes => {
  const userRepository = makeUserRepository();
  const sut = new SignUp(userRepository);
  return {
    sut,
    userRepository,
  };
};

describe('SignUp Use Case', () => {
  it('Should call user entity with correct values', async () => {
    const { sut } = makeSut();
    const userSpy = jest.spyOn(User, 'create');
    await sut.execute({ name: 'any_name', email: 'any_email@test.com', password: 'any_password1' });
    expect(userSpy).toHaveBeenCalledWith('any_name', 'any_email@test.com', 'any_password1');
  });

  it('Should return an error if name is invalid', async () => {
    const { sut } = makeSut();
    const error = await sut.execute({ name: '', email: 'any_email@test.com', password: 'any_password1' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidNameError(''));
  });

  it('Should return an error if email is invalid', async () => {
    const { sut } = makeSut();
    const error = await sut.execute({ name: 'any_name', email: '', password: 'any_password1' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(''));
  });

  it('Should return an error if password is invalid', async () => {
    const { sut } = makeSut();
    const error = await sut.execute({ name: 'any_name', email: 'any_email@test.com', password: '' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidPasswordError(''));
  });

  it('Should call findByEmail with correct values', async () => {
    const { sut, userRepository } = makeSut();
    const userRepositorySpy = jest.spyOn(userRepository, 'findByEmail');
    await sut.execute({ name: 'any_name', email: 'any_email@test.com', password: 'any_password1' });
    expect(userRepositorySpy).toHaveBeenCalledWith('any_email@test.com');
  });

  it('Should throw if findByEmail throws', async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const promise = sut.execute({ name: 'any_name', email: 'any_email@test.com', password: 'any_password1' });
    await expect(promise).rejects.toThrow();
  });

  it('Should return an error if user already exists', async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(new Promise((resolve) => resolve({
      id: '1', name: 'any_name', email: 'any_email@test.com', password: 'any_password1',
    })));
    const error = await sut.execute({ name: 'any_name', email: 'any_email@test.com', password: 'any_password1' });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new ExistingUserError());
  });

  it.todo('Should call Hasher with correct password');
  it.todo('Should throw if Hasher throws');
  it.todo('Should call Encrypter with correct password');
  it.todo('Should throw if Encrypter throws');
  it.todo('Should call AddAccount with correct values');
  it.todo('Should throw if AddAccount throws');
  it.todo('Should return an account and an accessToken on success');
});
