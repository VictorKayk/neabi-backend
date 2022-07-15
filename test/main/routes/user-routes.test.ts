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
  async compare(hash: string, value: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

describe('User Routes', () => {
  it('Should return 201 on sign up route success', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
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

  it('Should return 200 on sign in route success', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await request(app)
      .post('/api/signin')
      .send({
        email: user.build().email,
        password: user.build().password,
      }).expect(200);
  });

  it('Should return 401 if account already exists on sign up route', async () => {
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
});
