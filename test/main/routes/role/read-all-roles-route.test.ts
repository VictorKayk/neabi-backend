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
});

describe('ReadAllRoles Route', () => {
  it('Should return 200 on read all roles route success', async () => {
    const roleReturn = {
      id: 'any_id',
      role: 'any_role',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    jest.spyOn(prisma.role, 'findMany').mockResolvedValue([roleReturn, roleReturn]);

    await request(app).get('/api/role/all')
      .set('x-access-token', 'any_encrypted_string')
      .expect(200);
  });

  it('Should return 500 if read all roles route throws', async () => {
    jest.spyOn(prisma.role, 'findMany').mockImplementationOnce(() => { throw new Error(); });

    await request(app).get('/api/role/all')
      .set('x-access-token', 'any_encrypted_string')
      .expect(500);
  });
});
