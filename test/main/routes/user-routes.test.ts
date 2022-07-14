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

describe('User Routes', () => {
  it('Should return 201 an account and accessToken on sign up route success', async () => {
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

  it('Should return 403 if account already exists', async () => {
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
});
