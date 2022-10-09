import { UpdateUrlByIdUseCase } from '@/use-cases/attachment/url/update-url-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { UrlRepository } from '@/infra/repositories';
import { makeUpdateUrlByIdValidationFactory } from '@/main/factories/attachment/url';
import { UpdateUrlByIdController } from '@/adapters/controllers/attachment/url/update-url-by-id';

export function makeUpdateUrlByIdController(): IController {
  const urlRepository = new UrlRepository();
  const updateUrlByIdUseCase = new UpdateUrlByIdUseCase(urlRepository);
  const updateUrlByIdController = new UpdateUrlByIdController(
    makeUpdateUrlByIdValidationFactory(), updateUrlByIdUseCase,
  );
  return updateUrlByIdController;
}
