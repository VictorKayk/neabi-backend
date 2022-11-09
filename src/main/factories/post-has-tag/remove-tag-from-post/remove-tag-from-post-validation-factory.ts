import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeRemoveTagFromPostValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['postId', 'tagId'])]);
