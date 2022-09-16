import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeVerifyResetUserPasswordTokenValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['userId', 'token', 'password'])]);
