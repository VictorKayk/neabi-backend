import { RemoveAttachmentFromPostUseCase } from '@/use-cases/post-has-attachment/remove-attachment-from-post';
import { IController } from '@/adapters/controllers/interfaces';
import { PostHasAttachmentRepository } from '@/infra/repositories';
import { makeRemoveAttachmentFromPostValidationFactory } from '@/main/factories/post-has-attachment';
import { RemoveAttachmentFromPostController } from '@/adapters/controllers/post-has-attachment/remove-attachment-from-post';

export function makeRemoveAttachmentFromPostController(): IController {
  const postHasAttachmentRepository = new PostHasAttachmentRepository();
  const removeAttachmentFromPostUseCase = new RemoveAttachmentFromPostUseCase(
    postHasAttachmentRepository,
  );
  const removeAttachmentFromPostController = new RemoveAttachmentFromPostController(
    makeRemoveAttachmentFromPostValidationFactory(), removeAttachmentFromPostUseCase,
  );
  return removeAttachmentFromPostController;
}
