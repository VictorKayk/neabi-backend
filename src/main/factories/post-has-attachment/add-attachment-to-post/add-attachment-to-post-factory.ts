import { AddAttachmentToPostUseCase } from '@/use-cases/post-has-attachment/add-attachment-to-post';
import { IController } from '@/adapters/controllers/interfaces';
import { PostHasAttachmentRepository } from '@/infra/repositories';
import { makeAddAttachmentToPostValidationFactory } from '@/main/factories/post-has-attachment';
import { AddAttachmentToPostController } from '@/adapters/controllers/post-has-attachment/add-attachment-to-post';

export function makeAddAttachmentToPostController(): IController {
  const postHasAttachmentRepository = new PostHasAttachmentRepository();
  const addAttachmentToPostUseCase = new AddAttachmentToPostUseCase(postHasAttachmentRepository);
  const addAttachmentToPostController = new AddAttachmentToPostController(
    makeAddAttachmentToPostValidationFactory(), addAttachmentToPostUseCase,
  );
  return addAttachmentToPostController;
}
