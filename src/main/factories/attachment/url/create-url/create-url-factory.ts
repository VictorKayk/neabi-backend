import { CreateUrlUseCase } from '@/use-cases/attachment/url/create-url';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { UrlRepository } from '@/infra/repositories';
import { CreateUrlController } from '@/adapters/controllers/attachment/url/create-url';
import { makeCreateUrlValidationFactory } from '@/main/factories/attachment/url';

export function makeCreateUrlController(): IController {
  const urlRepository = new UrlRepository();
  const uuidAdapter = new UuidAdapter();
  const createUrlUseCase = new CreateUrlUseCase(urlRepository, uuidAdapter);
  const createUrlController = new CreateUrlController(
    makeCreateUrlValidationFactory(), createUrlUseCase,
  );
  return createUrlController;
}
