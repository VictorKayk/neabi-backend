import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeSignInValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['email', 'password']),
]);
