import { ReadAllTagsUseCase } from '@/use-cases/tag/read-all-tags';
import { IController } from '@/adapters/controllers/interfaces';
import { TagRepository } from '@/infra/repositories';
import { ReadAllTagsController } from '@/adapters/controllers/tag/read-all-tags';

export function makeReadAllTagsController(): IController {
  const tagRepository = new TagRepository();
  const readAllTagsUseCase = new ReadAllTagsUseCase(tagRepository);
  const readAllTagsController = new ReadAllTagsController(readAllTagsUseCase);
  return readAllTagsController;
}
