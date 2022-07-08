import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import { SignUp } from '@/use-cases/signup';

type SutTypes = {
  sut: SignUp,
}

const makeSut = (): SutTypes => {
  const sut = new SignUp();
  return {
    sut,
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
    expect(error.isSuccess()).toBe(true);
    expect(error.value).toEqual(new InvalidNameError(''));
  });

  it('Should return an error if email is invalid', async () => {
    const { sut } = makeSut();
    const error = await sut.execute({ name: 'any_name', email: '', password: 'any_password1' });
    expect(error.isSuccess()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(''));
  });

  it('Should return an error if password is invalid', async () => {
    const { sut } = makeSut();
    const error = await sut.execute({ name: 'any_name', email: 'any_email@test.com', password: '' });
    expect(error.isSuccess()).toBe(true);
    expect(error.value).toEqual(new InvalidPasswordError(''));
  });
});
