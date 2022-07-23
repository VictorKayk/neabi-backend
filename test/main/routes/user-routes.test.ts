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

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_encrypted_string'));
  },
  verify() {
    return { id: 'any_id' };
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

  it('Should return 401 if accessToken is not provided in an authenticated route', async () => {
    await request(app).get('/api/user').expect(401);
  });

  it('Should return 200 on read user route success', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await request(app).get('/api/user')
      .set('x-access-token', user.build().accessToken).expect(200);
  });

  it('Should return 401 if user do not exist in read user route', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

    await request(app).get('/api/user')
      .set('x-access-token', 'invalid_accessToken').expect(401);
  });

  it('Should return 200 on update user route success', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst')
      .mockResolvedValueOnce({
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce({
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce(null);

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await request(app).patch('/api/user')
      .set('x-access-token', user.build().accessToken)
      .send({
        name: 'new_name',
        email: 'new_email@test.com',
        password: 'new_password_1',
      })
      .expect(200);
  });

  it('Should return 400 on update user route if params are invalid', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst')
      .mockResolvedValueOnce({
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce({
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce(null);

    await request(app).patch('/api/user')
      .set('x-access-token', user.build().accessToken)
      .send({
        name: '',
        email: '',
        password: '',
      })
      .expect(400);
  });

  it('Should return 403 on update user route if user do not exists', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst')
      .mockResolvedValueOnce({
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce(null);

    await request(app).patch('/api/user')
      .set('x-access-token', user.build().accessToken)
      .send({
        name: 'new_name',
        email: 'new_email@test.com',
        password: 'new_password_1',
      })
      .expect(403);
  });

  it('Should return 403 on update user route if user exists', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst')
      .mockResolvedValue({
        ...user.build(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    await request(app).patch('/api/user')
      .set('x-access-token', user.build().accessToken)
      .send({
        name: 'new_name',
        email: 'new_email@test.com',
        password: 'new_password_1',
      })
      .expect(403);
  });

  it('Should return 200 on delete user route success', async () => {
    const { user } = makeSut();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(prisma.user, 'delete').mockResolvedValue({
      ...user.build(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await request(app).delete('/api/user')
      .set('x-access-token', user.build().accessToken).expect(200);
  });

  it('Should return 401 if user do not exist in delete user route', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

    await request(app).delete('/api/user')
      .set('x-access-token', 'invalid_accessToken').expect(401);
  });
});
