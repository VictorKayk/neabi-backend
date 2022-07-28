import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';

export const makeSignInValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['email', 'password']),
]);
