import { ReadAllAttachmentsFromPostUseCase } from '@/use-cases/post-has-attachment/read-all-attachments-from-post';
import { IController } from '@/adapters/controllers/interfaces';
import { PostHasAttachmentRepository } from '@/infra/repositories';
import { makeReadAllAttachmentsFromPostValidationFactory } from '@/main/factories/post-has-attachment';
import { ReadAllAttachmentsFromPostController } from '@/adapters/controllers/post-has-attachment/read-all-attachments-from-post';

export function makeReadAllAttachmentsFromPostController(): IController {
  const postHasAttachmentRepository = new PostHasAttachmentRepository();
  const readAllAttachmentsFromPostUseCase = new ReadAllAttachmentsFromPostUseCase(
    postHasAttachmentRepository,
  );
  const readAllAttachmentsFromPostController = new ReadAllAttachmentsFromPostController(
    makeReadAllAttachmentsFromPostValidationFactory(), readAllAttachmentsFromPostUseCase,
  );
  return readAllAttachmentsFromPostController;
}
