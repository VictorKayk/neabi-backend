import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeAddTagToPostValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['postId', 'tagId'])]);
