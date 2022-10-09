import { ReadAllUrlsUseCase } from '@/use-cases/attachment/url/read-all-urls';
import { IController } from '@/adapters/controllers/interfaces';
import { UrlRepository } from '@/infra/repositories';
import { ReadAllUrlsController } from '@/adapters/controllers/attachment/url/read-all-urls';

export function makeReadAllUrlsController(): IController {
  const urlRepository = new UrlRepository();
  const readAllFiesUseCase = new ReadAllUrlsUseCase(urlRepository);
  const readAllFiesController = new ReadAllUrlsController(readAllFiesUseCase);
  return readAllFiesController;
}
