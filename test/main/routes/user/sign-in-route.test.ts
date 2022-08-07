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
  async compare(hash: string, value: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_encrypted_string'));
  },
}));

describe('SignIn Route', () => {
  it('Should return 200 on sign in route success', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    await request(app)
      .post('/api/signin')
      .send({
        email: user.build().email,
        password: user.build().password,
      }).expect(200);
  });

  it('Should return 401 if account already exists on sign in route', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

    await request(app)
      .post('/api/signin')
      .send({
        email: user.build().email,
        password: user.build().password,
      })
      .expect(401);
  });

  it('Should return 500 if sign in route throws', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockImplementation(() => { throw new Error(); });

    await request(app)
      .post('/api/signin')
      .send({
        name: user.build().name,
        email: user.build().email,
        password: user.build().password,
        passwordConfirmation: user.build().password,
      })
      .expect(500);
  });
});
