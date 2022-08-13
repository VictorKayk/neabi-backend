import request from 'supertest';
import app from '@/main/config/app';
import prisma from '@/main/config/prisma';
import { UserBuilder } from '@/test/builders/user-builder';

type SutTypes = {
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const user = new UserBuilder();
  return {
    user,
  };
};

jest.mock('@/test/mocks/prisma-client.ts');

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hashed_password'));
  },
}));

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_encrypted_string'));
  },
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: jest.fn(),
  })),
}));

describe('SignUp Route', () => {
  it('Should return 201 on sign up route success', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        isVerified: false,
      });
    jest.spyOn(prisma.user, 'create')
      .mockResolvedValue({
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        isVerified: false,
      });
    jest.spyOn(prisma.verificationToken, 'create')
      .mockResolvedValue({
        userId: user.build().id,
        token: 'any_token',
        createdAt: new Date(),
        expiresAt: new Date(),
        isDeleted: false,
      });

    await request(app)
      .post('/api/signup')
      .send({
        name: user.build().name,
        email: user.build().email,
        password: user.build().password,
        passwordConfirmation: user.build().password,
      }).expect(201);
  });

  it('Should return 403 if account already exists on sign up route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
    });

    await request(app)
      .post('/api/signup')
      .send({
        name: user.build().name,
        email: user.build().email,
        password: user.build().password,
        passwordConfirmation: user.build().password,
      })
      .expect(403);
  });

  it('Should return 500 if sign up route throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockImplementation(() => { throw new Error(); });

    await request(app)
      .post('/api/signup')
      .send({
        name: user.build().name,
        email: user.build().email,
        password: user.build().password,
        passwordConfirmation: user.build().password,
      })
      .expect(500);
  });
});
