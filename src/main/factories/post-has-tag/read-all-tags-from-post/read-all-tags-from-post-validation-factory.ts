import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeReadAllTagsFromPostValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['postId'])]);
