import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeVerifyTokenValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['userId', 'token'])]);
