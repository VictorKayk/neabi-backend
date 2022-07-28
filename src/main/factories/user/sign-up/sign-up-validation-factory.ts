import { ValidationComposite, RequiredFieldsValidation, CompareFieldsValidation } from '@/adapters/controllers/util/validations';

export const makeSignUpValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
  new CompareFieldsValidation('password', 'passwordConfirmation'),
]);
