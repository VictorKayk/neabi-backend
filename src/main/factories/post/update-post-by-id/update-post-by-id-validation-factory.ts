import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeUpdatePostByIdValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['postId'])]);
