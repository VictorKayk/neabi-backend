import { EmailService } from '@/infra/services/email-service';
import { IEmailOptions } from '@/use-cases/services/email-service/interfaces';

type SutTypes = {
  sut: EmailService,
};

const makeSut = (): SutTypes => {
  const fromName = 'Test';
  const fromEmail = 'from_email@mail.com';
  const host = 'any_host';
  const port = 867;
  const user = 'any_username';
  const clientId = 'any_clientId';
  const clientSecret = 'any_clientSecret';
  const refreshToken = 'any_refreshToken';
  const from = `${fromName} ${fromEmail}`;

  const sut = new EmailService(host, port, from, {
    user, clientId, clientSecret, refreshToken,
  });

  return {
    sut,
  };
};

const toName = 'any_name';
const toEmail = 'any_email@mail.com';
const subject = 'Test e-mail';
const emailBody = 'Hello world attachment it';
const emailBodyHtml = '<b>Hello world attachment it HTML</b>';

const mailOptions: IEmailOptions = {
  to: `${toName} <${toEmail}>`,
  subject,
  text: emailBody,
  html: emailBodyHtml,
};

jest.mock('nodemailer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

const sendMailMock = jest.fn().mockReturnValueOnce('ok');
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

beforeEach(() => {
  sendMailMock.mockClear();
  nodemailer.createTransport.mockClear();
});

describe('Nodemailer mail service adapter', () => {
  it('Should return null if email is sent', async () => {
    const { sut } = makeSut();

    sendMailMock.mockReturnValueOnce('ok');

    const response = await sut.send({ ...mailOptions, attachments: [] });
    expect(response).toBe(null);
  });

  it('Should call nodemailer createTransport with correct options', async () => {
    const { sut } = makeSut();

    const spyCreateTransport = jest.spyOn(nodemailer, 'createTransport');

    await sut.send(mailOptions);
    expect(spyCreateTransport).toHaveBeenCalledWith({
      host: 'any_host',
      port: 867,
      auth: {
        type: 'OAuth2',
        user: 'any_username',
        clientId: 'any_clientId',
        clientSecret: 'any_clientSecret',
        refreshToken: 'any_refreshToken',
      },
      secure: true,
    });
  });
});
