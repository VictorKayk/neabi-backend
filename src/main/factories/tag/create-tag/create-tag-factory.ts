import { CreateTagUseCase } from '@/use-cases/tag/create-tag';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { TagRepository } from '@/infra/repositories';
import { makeCreateTagValidationFactory } from '@/main/factories/tag';
import { CreateTagController } from '@/adapters/controllers/tag/create-tag';

export function makeCreateTagController(): IController {
  const tagRepository = new TagRepository();
  const uuidAdapter = new UuidAdapter();
  const createTagUseCase = new CreateTagUseCase(tagRepository, uuidAdapter);
  const createTagController = new CreateTagController(
    makeCreateTagValidationFactory(), createTagUseCase,
  );
  return createTagController;
}
