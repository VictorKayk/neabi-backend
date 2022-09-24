import { Description } from '@/entities/value-object';
import { InvalidDescriptionError } from '@/entities/value-object/errors';

describe('Description Entity', () => {
  it('Should create a description on success', () => {
    const description = Description.create('any_description');
    expect(description.isSuccess()).toBe(true);
    expect(description.value).toEqual({ value: 'any_description' });
  });

  it('Should return an error if description is empty', () => {
    const description = Description.create('');
    expect(description.isError()).toBe(true);
    expect(description.value).toEqual(new InvalidDescriptionError(''));
  });

  it('Should return an error if description is too short', () => {
    const description = Description.create('de');
    expect(description.isError()).toBe(true);
    expect(description.value).toEqual(new InvalidDescriptionError('de'));
  });
});
