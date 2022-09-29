import { Either, error, success } from '@/shared';
import { Title, Slug, Description } from '@/entities/value-object';
import { InvalidTitleError, InvalidDescriptionError, InvalidSlugError } from '@/entities/value-object/errors';
import { IPostCreate } from '@/entities/post/interfaces';

export class Post {
  readonly title?: Title;

  readonly slug?: Slug;

  readonly description?: Description;

  private constructor(title?: Title, slug?: Slug, description?: Description) {
    this.title = title;
    this.slug = slug;
    this.description = description;
    Object.freeze(this);
  }

  public static create({ title, slug, description }: IPostCreate):
    Either<InvalidTitleError | InvalidSlugError | InvalidDescriptionError, Post> {
    let titleOrError;
    if (title !== undefined) {
      titleOrError = Title.create(title);
      if (titleOrError.isError()) return error(new InvalidTitleError(title));
    }

    let slugOrError;
    if (slug !== undefined) {
      slugOrError = Slug.create(slug);
      if (slugOrError.isError()) return error(new InvalidSlugError(slug));
    }

    let descriptionOrError;
    if (description !== undefined) {
      descriptionOrError = Description.create(description);
      if (descriptionOrError.isError()) return error(new InvalidDescriptionError(description));
    }

    const titleObj = titleOrError?.value;
    const slugObj = slugOrError?.value;
    const descriptionObj = descriptionOrError?.value;
    return success(new Post(titleObj, slugObj, descriptionObj));
  }
}
