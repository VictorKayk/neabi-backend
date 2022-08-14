import request from 'supertest';
import app from '@/main/config/app';
import prisma from '@/main/config/prisma';
import { UserBuilder } from '@/test/builders/user-builder';

type SutTypes = {
  user: UserBuilder,
};

const makeSut = (): SutTypes => {
  const user = new UserBuilder();

  jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
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

  return {
    user,
  };
};

jest.mock('@/test/mocks/prisma-client.ts');

jest.mock('bcrypt', () => ({
  async compare(hash: string, value: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

jest.mock('jsonwebtoken', () => ({
  verify() {
    return { id: 'any_id' };
  },
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: jest.fn().mockResolvedValueOnce(null),
  })),
}));

describe('SendVerificationTokenToUser Route', () => {
  it('Should return 200 on send verification token to user route success', async () => {
    const { user } = makeSut();

    await request(app).get('/api/user/verification-token')
      .set('x-access-token', user.build().accessToken).expect(200);
  });

  it('Should return 403 if user do not exist in send verification token to user route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
    }).mockResolvedValueOnce(null);

    await request(app).get('/api/user/verification-token')
      .set('x-access-token', user.build().accessToken).expect(403);
  });

  it('Should return 500 if send verification token to user route throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isVerified: false,
    }).mockImplementationOnce(() => { throw new Error(); });

    await request(app).get('/api/user/verification-token')
      .set('x-access-token', user.build().accessToken).expect(500);
  });
});
