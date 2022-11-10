import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeReadAllPostsFromTagValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['tagId'])]);
