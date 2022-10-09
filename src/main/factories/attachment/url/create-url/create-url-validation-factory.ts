import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeCreateUrlValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['name', 'url']),
]);
