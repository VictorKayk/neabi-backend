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
});

describe('DeleteRoleById Route', () => {
  it('Should return 200 on delete role by id route success', async () => {
    jest.spyOn(prisma.roles, 'findFirst')
      .mockResolvedValue({ id: 'any_id', role: 'any_role', createdAt: new Date() });
    jest.spyOn(prisma.roles, 'delete')
      .mockResolvedValue({ id: 'any_id', role: 'any_role', createdAt: new Date() });

    await request(app).delete('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .expect(200);
  });

  it('Should return 401 if role do not exist in delete role by id route', async () => {
    jest.spyOn(prisma.roles, 'findFirst').mockResolvedValue(null);

    await request(app).delete('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .expect(401);
  });

  it('Should return 500 if delete role by id route throws', async () => {
    jest.spyOn(prisma.roles, 'findFirst')
      .mockResolvedValue({ id: 'any_id', role: 'any_role', createdAt: new Date() });
    jest.spyOn(prisma.roles, 'delete').mockImplementationOnce(() => { throw new Error(); });

    await request(app).delete('/api/role/any_id')
      .set('x-access-token', 'any_encrypted_string')
      .expect(500);
  });
});
