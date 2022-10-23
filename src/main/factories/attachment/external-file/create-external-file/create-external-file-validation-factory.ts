import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeCreateExternalFileValidationFactory = ():
  ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['fileId', 'access_token']),
]);
