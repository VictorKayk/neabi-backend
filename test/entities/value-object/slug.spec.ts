import { Slug } from '@/entities/value-object';
import { InvalidSlugError } from '@/entities/value-object/errors';

describe('Slug Entity', () => {
  it('Should create a slug on success', () => {
    const slug = Slug.create('any_slug');
    expect(slug.isSuccess()).toBe(true);
    expect(slug.value).toEqual({ value: 'any_slug' });
  });

  it('Should return an error if slug is empty', () => {
    const slug = Slug.create('');
    expect(slug.isError()).toBe(true);
    expect(slug.value).toEqual(new InvalidSlugError(''));
  });

  it('Should return an error if slug is too short', () => {
    const slug = Slug.create('sl');
    expect(slug.isError()).toBe(true);
    expect(slug.value).toEqual(new InvalidSlugError('sl'));
  });
});
