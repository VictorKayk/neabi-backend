import { Name } from '@/entities/name';
import { InvalidNameError } from '@/entities/errors/invalid-name-error';

describe('Name Entity', () => {
  it('Should create a name on success', () => {
    const name = Name.create('any_name');
    expect(name.isSuccess()).toBe(true);
    expect(name.value).toEqual({ value: 'any_name' });
  });

  it('Should return an error if name is empty', () => {
    const name = Name.create('');
    expect(name.isError()).toBe(true);
    expect(name.value).toEqual(new InvalidNameError(''));
  });

  it('Should return an error if name is too short', () => {
    const name = Name.create('nam');
    expect(name.isError()).toBe(true);
    expect(name.value).toEqual(new InvalidNameError('nam'));
  });
});
