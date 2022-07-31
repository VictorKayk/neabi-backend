import { Role } from '@/entities/value-object';
import { InvalidRoleError } from '@/entities/value-object/errors';

describe('Role', () => {
  it('Should create an role on success', () => {
    const role = Role.create('any_role');
    expect(role.isSuccess()).toBe(true);
    expect(role.value).toEqual({ value: 'any_role' });
  });

  it('Should return an error if role is empty', () => {
    const error = Role.create('');
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidRoleError(''));
  });

  it('Should return an error if role is smaller than 3 chars', () => {
    const error = Role.create('ro');
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidRoleError('ro'));
  });
});
