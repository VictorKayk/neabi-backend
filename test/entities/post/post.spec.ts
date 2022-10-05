import { Post } from '@/entities/post';
import { InvalidSlugError, InvalidTitleError, InvalidDescriptionError } from '@/entities/value-object/errors';

describe('Post Entity', () => {
  it('Should create an user on success', () => {
    const userOrError = Post.create({
      title: 'any_title',
      slug: 'any_slug',
      description: 'any_description',
    });

    expect(userOrError.isSuccess()).toBe(true);
    const user = userOrError.value as Post;
    expect(user.title?.value).toEqual('any_title');
    expect(user.slug?.value).toEqual('any_slug');
    expect(user.description?.value).toEqual('any_description');
  });

  it('Should return an error if title is invalid', () => {
    const error = Post.create({
      title: '',
      slug: 'any_slug',
      description: 'any_description',
    });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidTitleError(''));
  });

  it('Should create an error if slug is invalid', () => {
    const error = Post.create({
      title: 'any_title',
      slug: '',
      description: 'any_description',
    });
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidSlugError(''));
  });

  it('Should create an error if description is invalid', () => {
    const error = Post.create({
      title: 'any_title',
      slug: 'any_slug',
      description: '',
    });
    expect(error.isSuccess()).toBe(false);
    expect(error.value).toEqual(new InvalidDescriptionError(''));
  });
});
