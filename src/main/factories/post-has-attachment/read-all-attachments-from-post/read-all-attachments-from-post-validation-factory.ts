import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeReadAllAttachmentsFromPostValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['postId'])]);
