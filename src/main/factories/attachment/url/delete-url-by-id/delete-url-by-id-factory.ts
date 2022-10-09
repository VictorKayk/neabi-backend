import { DeleteUrlByIdUseCase } from '@/use-cases/attachment/url/delete-url-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { UrlRepository } from '@/infra/repositories';
import { makeDeleteUrlByIdValidationFactory } from '@/main/factories/attachment/url';
import { DeleteUrlByIdController } from '@/adapters/controllers/attachment/url/delete-url-by-id';

export function makeDeleteUrlByIdController(): IController {
  const urlRepository = new UrlRepository();
  const deleteUrlUseCase = new DeleteUrlByIdUseCase(urlRepository);
  const deleteUrlController = new DeleteUrlByIdController(
    makeDeleteUrlByIdValidationFactory(),
    deleteUrlUseCase,
  );
  return deleteUrlController;
}
