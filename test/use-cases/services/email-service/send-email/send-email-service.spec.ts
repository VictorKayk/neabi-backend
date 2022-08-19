import { makeEmailService } from '@/test/stubs/email-service-stub';
import { EmailServiceError } from '@/use-cases/services/email-service/errors';
import { IEmailService } from '@/use-cases/services/email-service/interfaces';
import { SendEmailService } from '@/use-cases/services/email-service/send-email';

type SutTypes = {
  sut: SendEmailService,
  emailService: IEmailService,
};

const makeSut = (): SutTypes => {
  const emailService = makeEmailService();
  const sut = new SendEmailService(emailService);

  return {
    sut,
    emailService,
  };
};

describe('SendEmailService', () => {
  it('Should call send', async () => {
    const { sut, emailService } = makeSut();

    const emailServiceSpy = jest.spyOn(emailService, 'send');

    await sut.execute({
      user: { name: 'any_name', email: 'any_email@test.com' },
      subject: 'any_subject',
      text: 'any_text',
      html: 'any_html',
    });
    expect(emailServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('Should return an error if send throws', async () => {
    const { sut, emailService } = makeSut();

    jest.spyOn(emailService, 'send').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const response = await sut.execute({
      user: { name: 'any_name', email: 'any_email@test.com' },
      subject: 'any_subject',
      text: 'any_text',
      html: 'any_html',
    });
    expect(response.isError()).toBe(true);
    expect(response.value).toEqual(new EmailServiceError());
  });

  it('Should return null on success', async () => {
    const { sut, emailService } = makeSut();

    jest.spyOn(emailService, 'send').mockResolvedValue(null);

    const response = await sut.execute({
      user: { name: 'any_name', email: 'any_email@test.com' },
      subject: 'any_subject',
      text: 'any_text',
      html: 'any_html',
    });
    expect(response.isSuccess()).toBe(true);
    expect(response.value).toBe(null);
  });
});
