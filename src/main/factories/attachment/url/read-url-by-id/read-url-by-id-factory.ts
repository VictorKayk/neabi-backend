import { ReadUrlByIdUseCase } from '@/use-cases/attachment/url/read-url-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { UrlRepository } from '@/infra/repositories';
import { ReadUrlByIdController } from '@/adapters/controllers/attachment/url/read-url-by-id';
import { makeReadUrlByIdValidationFactory } from '@/main/factories/attachment/url';

export function makeReadUrlByIdController(): IController {
  const urlRepository = new UrlRepository();
  const readUrlByIdUseCase = new ReadUrlByIdUseCase(urlRepository);
  const readUrlByIdController = new ReadUrlByIdController(
    makeReadUrlByIdValidationFactory(), readUrlByIdUseCase,
  );
  return readUrlByIdController;
}
