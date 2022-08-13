import { makeEmailService } from '@/test/stubs/email-service-stub';
import { EmailServiceError } from '@/use-cases/email-service/errors';
import { IEmailService } from '@/use-cases/email-service/interfaces';
import { SendVerificationTokenUseCase } from '@/use-cases/email-service/send-verification-token';

type SutTypes = {
  sut: SendVerificationTokenUseCase,
  emailService: IEmailService,
};

const makeSut = (): SutTypes => {
  const emailService = makeEmailService();
  const sut = new SendVerificationTokenUseCase(
    'http://url.test', emailService,
  );

  return {
    sut,
    emailService,
  };
};

describe('SendVerificationTokenUseCase', () => {
  it('Should call send', async () => {
    const { sut, emailService } = makeSut();

    const emailServiceSpy = jest.spyOn(emailService, 'send');

    await sut.execute({
      user: { id: 'any_userId', name: 'any_name', email: 'any_email@test.com' },
      token: 'any_token',
      expiresInHours: 1,
    });
    expect(emailServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('Should return an error if send throws', async () => {
    const { sut, emailService } = makeSut();

    jest.spyOn(emailService, 'send').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const response = await sut.execute({
      user: { id: 'any_userId', name: 'any_name', email: 'any_email@test.com' },
      token: 'any_token',
      expiresInHours: 1,
    });
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new EmailServiceError());
  });

  it('Should return null on success', async () => {
    const { sut, emailService } = makeSut();

    jest.spyOn(emailService, 'send').mockResolvedValue(null);

    const response = await sut.execute({
      user: { id: 'any_userId', name: 'any_name', email: 'any_email@test.com' },
      token: 'any_token',
      expiresInHours: 2,
    });
    expect(response.isSuccess()).toBe(true);
    expect(response.value).toBe(null);
  });
});
