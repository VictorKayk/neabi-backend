import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeCreatePostValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['title', 'description']),
]);
