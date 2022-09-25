import request from 'supertest';
import app from '@/main/config/app';
import prisma from '@/main/config/prisma';
import { UserBuilder } from '@/test/builders/user-builder';

jest.mock('@/test/mocks/prisma-client.ts');

// Authentication
jest.mock('bcrypt', () => ({
  async compare(hash: string, value: string): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

// Authorization
const userHasRoles = {
  userId: 'any_userId',
  roleId: 'any_roleId',
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  Roles: {
    id: 'any_id',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  },
};
jest.spyOn(prisma.userHasRoles, 'findMany').mockResolvedValue([userHasRoles]);

jest.mock('jsonwebtoken', () => ({
  verify() {
    return { id: 'any_id' };
  },
}));

jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
  ...new UserBuilder().build(),
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  isVerified: false,
});

describe('CreatePost Route', () => {
  it('Should return 201 on create post route success', async () => {
    jest.spyOn(prisma.post, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prisma.post, 'create')
      .mockResolvedValue({
        id: 'any_id',
        title: 'any_title',
        slug: 'any_slug',
        description: 'any_description',
        descriptionHtml: 'any_descriptionHtml',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

    await request(app)
      .post('/api/post')
      .set('x-access-token', 'any_encrypted_string')
      .send({ title: 'any_title', description: '<p>any_description</p>' })
      .expect(201);
  });

  it('Should return 400 if some values are invalid', async () => {
    jest.spyOn(prisma.post, 'findFirst').mockResolvedValue(null);

    await request(app)
      .post('/api/post')
      .set('x-access-token', 'any_encrypted_string')
      .send({ title: '', description: '<p>any_description</p>' })
      .expect(400);
  });

  it('Should return 500 if create post route throws', async () => {
    jest.spyOn(prisma.post, 'findFirst').mockImplementation(() => { throw new Error(); });

    await request(app)
      .post('/api/post')
      .set('x-access-token', 'any_encrypted_string')
      .send({ title: 'any_title', description: '<p>any_description</p>' })
      .expect(500);
  });
});
