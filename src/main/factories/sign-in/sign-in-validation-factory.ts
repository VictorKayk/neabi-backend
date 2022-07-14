import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/util/validations';

export const makeSignInValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['email', 'password']),
]);
