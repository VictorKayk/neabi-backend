import { Title } from '@/entities/value-object';
import { InvalidTitleError } from '@/entities/value-object/errors';

describe('Title Entity', () => {
  it('Should create a title on success', () => {
    const title = Title.create('any_title');
    expect(title.isSuccess()).toBe(true);
    expect(title.value).toEqual({ value: 'any_title' });
  });

  it('Should return an error if title is empty', () => {
    const title = Title.create('');
    expect(title.isError()).toBe(true);
    expect(title.value).toEqual(new InvalidTitleError(''));
  });

  it('Should return an error if title is too short', () => {
    const title = Title.create('ti');
    expect(title.isError()).toBe(true);
    expect(title.value).toEqual(new InvalidTitleError('ti'));
  });
});
