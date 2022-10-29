import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeRemoveAttachmentFromPostValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['postId', 'attachmentId'])]);
